export type RecordingSession = { id: string; token: string };
export type ChatMessageRecord = {
  sourceCollection: string;
  channelId: string;
  messageId: string;
  senderId: string;
  receiverUserId: number;
};
type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;
export type RecordingDependencies = {
  storage: () => StoragePort;
  session: () => RecordingSession | null;
  read: (record: ChatMessageRecord) => Promise<'ready' | 'pending' | 'rejected'>;
  post: (body: Omit<ChatMessageRecord, 'senderId'>, session: RecordingSession) => Promise<number>;
  retryMs?: number;
};

/** Only references persist. A recording failure must never resend the Firestore message. */
export function createChatMessageRecordingQueue(deps: RecordingDependencies) {
  const prefix = 'chat-message-recording-v1:';
  const key = (r: ChatMessageRecord) =>
    prefix + JSON.stringify([r.senderId, r.sourceCollection, r.channelId, r.messageId]);
  let active: Promise<void> | null = null;
  let retry: ReturnType<typeof setTimeout> | undefined;
  const records = () => {
    const storage = deps.storage();
    const values: ChatMessageRecord[] = [];
    for (let i = 0; i < storage.length; i++) {
      const name = storage.key(i);
      if (!name?.startsWith(prefix)) continue;
      try {
        const r = JSON.parse(storage.getItem(name) ?? 'null') as ChatMessageRecord;
        if (r && key(r) === name && Number.isSafeInteger(r.receiverUserId) && r.receiverUserId > 0)
          values.push(r);
      } catch {
        /* One corrupt item cannot block other accepted messages. */
      }
    }
    return values;
  };
  const same = (owner: RecordingSession) => {
    const current = deps.session();
    return current?.id === owner.id && current.token === owner.token;
  };
  async function drain() {
    clearTimeout(retry);
    const owner = deps.session();
    if (!owner?.id || !owner.token) return;
    for (const record of records()) {
      if (record.senderId !== owner.id) continue;
      if (!same(owner)) return;
      try {
        const state = await deps.read(record);
        if (!same(owner)) return;
        if (state === 'pending') continue;
        const body = {
          sourceCollection: record.sourceCollection,
          channelId: record.channelId,
          messageId: record.messageId,
          receiverUserId: record.receiverUserId,
        };
        const status = state === 'rejected' ? 400 : await deps.post(body, owner);
        if (status === 401) return; // Resume after authentication, not in a retry loop.
        if (status === 0 || status >= 500 || status === 429) continue;
        if (status >= 400) console.warn('Chat recording rejected', status, key(record));
        deps.storage().removeItem(key(record));
      } catch (error) {
        const code = (error as { code?: string })?.code;
        if (code && ['permission-denied', 'not-found', 'invalid-argument'].includes(code)) {
          deps.storage().removeItem(key(record));
          console.warn('Chat recording source rejected', code);
        }
      }
    }
    if (same(owner) && records().some((r) => r.senderId === owner.id))
      retry = setTimeout(() => void flush(), deps.retryMs ?? 30000);
  }
  function flush(): Promise<void> {
    if (!active)
      active = drain()
        .catch((error) => {
          console.warn('Chat recording queue unavailable', error);
        })
        .finally(() => {
          active = null;
        });
    return active;
  }
  function enqueue(record: ChatMessageRecord) {
    try {
      deps.storage().setItem(key(record), JSON.stringify(record));
      void flush();
    } catch (error) {
      console.warn('Chat recording persistence failed', error);
    }
  }
  return { enqueue, flush, dispose: () => clearTimeout(retry) };
}
