export type RecordingSession = { id: string; token: string };
export type ChatMessageRecordBody = {
  sourceCollection: string;
  channelId: string;
  messageId: string;
  receiverUserId: number;
  messageType: string;
  messageSubType?: string;
  analyticsKind: 'user' | 'automatic';
  isSystemMessage: boolean;
  senderId: string;
  sentAt: string;
  beautyApplicationId?: number;
  thunderAnnouncementId?: number;
  v3HairConsultationId?: number;
  timeSaleMenuId?: number;
};
export type ChatMessageRecord = {
  sourceCollection: string;
  channelId: string;
  messageId: string;
  senderId: string;
  receiverUserId: number;
  recordingUserId?: string;
  body?: ChatMessageRecordBody;
};
type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;
export type RecordingDependencies = {
  storage: () => StoragePort;
  session: () => RecordingSession | null;
  read: (record: ChatMessageRecord) => Promise<'ready' | 'pending' | 'rejected'>;
  post: (body: ChatMessageRecordBody, session: RecordingSession) => Promise<number>;
  retryMs?: number;
};

export function resolveChatMessageRecord(
  record: ChatMessageRecord,
  message: Record<string, unknown>,
  channel: Record<string, unknown>,
  sentAt: string,
): 'ready' | 'rejected' {
  if (record.body) return 'ready';
  if (
    String(message.senderId) !== record.senderId ||
    message.deletedAt != null ||
    (record.senderId !== 'system' &&
      record.senderId !== (record.recordingUserId ?? record.senderId))
  )
    return 'rejected';
  const type = message.messageType;
  if (typeof type !== 'string' || !type.trim() || type.length > 64) return 'rejected';
  const meta = Array.isArray(message.metaPathList) ? message.metaPathList : [];
  const subtype = meta.find((item) => item?.key === 'MESSAGE_TYPE')?.value;
  if (subtype != null && (typeof subtype !== 'string' || subtype.length > 128)) return 'rejected';
  const explicitKind = message.analyticsKind;
  if (explicitKind != null && explicitKind !== 'user' && explicitKind !== 'automatic')
    return 'rejected';
  const system = message.isSystemMessage === true || record.senderId === 'system';
  const automatic =
    explicitKind === 'automatic' ||
    (explicitKind !== 'user' &&
      (system ||
        type === 'system' ||
        /(?:(?:채팅을|대화를) 시작했습니다|공고에 지원했습니다)[.!]?\s*$/.test(
          String(message.message ?? ''),
        )));
  const body: ChatMessageRecordBody = {
    sourceCollection: record.sourceCollection,
    channelId: record.channelId,
    messageId: record.messageId,
    receiverUserId: record.receiverUserId,
    messageType: type,
    ...(subtype != null ? { messageSubType: subtype } : {}),
    analyticsKind: automatic ? 'automatic' : 'user',
    isSystemMessage: system,
    senderId: record.senderId,
    sentAt,
  };
  const fields: Record<string, 'beautyApplicationId' | 'thunderAnnouncementId' | 'timeSaleMenuId'> =
    {
      MODEL_ANNOUNCEMENT: 'beautyApplicationId',
      QUICK_MATCHING_PREMIUM: 'thunderAnnouncementId',
      QUICK_MATCHING_GENERAL: 'thunderAnnouncementId',
      REVIEW_SPECIAL: 'timeSaleMenuId',
    };
  for (const field of [
    'beautyApplicationId',
    'thunderAnnouncementId',
    'v3HairConsultationId',
    'timeSaleMenuId',
  ] as const) {
    const value =
      channel[field] ?? (fields[String(channel.postType)] === field ? channel.postId : undefined);
    if (/^[1-9][0-9]*$/.test(String(value)) && Number.isSafeInteger(Number(value)))
      body[field] = Number(value);
  }
  // The V3 writer stores v3-{questionId} in postId and v3-{answerId} in answerId.
  // Numeric legacy HAIR_CONSULTATION and EXPERIENCE_GROUP IDs belong to /hair-consultations,
  // which has no link field in this API. Never derive a question ID from a room or answer ID.
  if (
    channel.schemaVersion === 2 &&
    channel.channelType === 'hairConsultation' &&
    channel.postType === 'HAIR_CONSULTATION'
  ) {
    const questionId = /^v3-([1-9][0-9]*)$/.exec(String(channel.postId))?.[1];
    if (questionId && Number.isSafeInteger(Number(questionId)) && body.v3HairConsultationId == null)
      body.v3HairConsultationId = Number(questionId);
  }
  record.body = body;
  return 'ready';
}

/** A recording failure retries metadata only, never the accepted Firestore message. */
export function createChatMessageRecordingQueue(deps: RecordingDependencies) {
  const prefix = 'chat-message-recording-v1:';
  const ownerId = (r: ChatMessageRecord) => r.recordingUserId ?? r.senderId;
  const key = (r: ChatMessageRecord) =>
    prefix + JSON.stringify([ownerId(r), r.sourceCollection, r.channelId, r.messageId]);
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
      if (ownerId(record) !== owner.id) continue;
      if (!same(owner)) return;
      try {
        const state = record.body ? 'ready' : await deps.read(record);
        if (!same(owner)) return;
        if (state === 'pending') continue;
        if (state === 'ready') {
          if (!record.body) throw new Error('Chat recording metadata is not resolved');
          // Freeze metadata before the first HTTP attempt; a lost response must
          // not turn a retry into a conflicting update of the same message ID.
          deps.storage().setItem(key(record), JSON.stringify(record));
          if (!same(owner)) return;
        }
        let status = state === 'rejected' ? 400 : await deps.post(record.body!, owner);
        const sourceFields = [
          'beautyApplicationId',
          'thunderAnnouncementId',
          'v3HairConsultationId',
          'timeSaleMenuId',
        ] as const;
        if (status === 400 && record.body && sourceFields.some((field) => field in record.body!)) {
          // Deleted/invalid optional links must not discard accepted message metadata.
          // Retry once without links while keeping all duplicate-check fields identical.
          record.body = { ...record.body };
          for (const field of sourceFields) delete record.body[field];
          deps.storage().setItem(key(record), JSON.stringify(record));
          if (!same(owner)) return;
          status = await deps.post(record.body, owner);
        }
        if (status === 401) return;
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
    if (same(owner) && records().some((r) => ownerId(r) === owner.id))
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
      const existing = records().find((r) => key(r) === key(record));
      deps.storage().setItem(key(record), JSON.stringify(existing?.body ? existing : record));
      void flush();
    } catch (error) {
      console.warn('Chat recording persistence failed', error);
    }
  }
  return { enqueue, flush, dispose: () => clearTimeout(retry) };
}
