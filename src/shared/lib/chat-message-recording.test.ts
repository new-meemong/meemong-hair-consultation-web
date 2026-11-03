import { afterEach, expect, it, vi } from 'vitest';
import { Timestamp } from 'firebase/firestore';

const state = vi.hoisted(() => ({
  read: vi.fn(),
  post: vi.fn(),
  user: { id: 11, role: 1, token: 'sender-token' },
}));
vi.mock('firebase/firestore', async (original) => ({
  ...(await original<typeof import('firebase/firestore')>()),
  doc: (...args: unknown[]) => args,
  getDocFromServer: state.read,
}));
vi.mock('./firebase', () => ({ db: {}, getConsultationFirestore: () => ({}) }));
vi.mock('./auth', () => ({ getCurrentUser: () => state.user }));
vi.mock('@/shared/api/client', () => ({
  apiClient: { postChatSideEffect: state.post, postChatMessageRecord: state.post },
  ApiRequestError: class extends Error {},
}));
import { chatMessageRecording, recordAcceptedChatMessage } from './chat-message-recording';

const reference = {
  sourceCollection: 'hairConsultationChatChannels',
  channelId: 'room',
  messageId: 'message',
  senderId: '11',
  receiverUserId: 22,
};
const at = Timestamp.fromDate(new Date('2026-10-30T00:00:00.000Z'));
function source(
  message: Record<string, unknown>,
  channel: Record<string, unknown> = {},
  pending = false,
) {
  state.read.mockImplementation(async (path: unknown[]) => ({
    exists: () => true,
    metadata: { hasPendingWrites: pending },
    data: () => (path.length === 5 ? message : channel),
  }));
}
afterEach(() => {
  chatMessageRecording.dispose();
  localStorage.clear();
  vi.clearAllMocks();
});
it.each(['11', '22'])(
  'reads confirmed original metadata and upgrades an old outbox, sender=%s',
  async (senderId) => {
    const r = { ...reference, senderId, receiverUserId: senderId === '11' ? 22 : 11 };
    state.user.id = Number(senderId);
    source(
      {
        senderId,
        messageType: 'reservation',
        analyticsKind: 'user',
        createdAt: at,
        metaPathList: [{ key: 'MESSAGE_TYPE', value: 'RESERVATION_CANCELLED' }],
      },
      {
        schemaVersion: 2,
        channelType: 'hairConsultation',
        postType: 'HAIR_CONSULTATION',
        postId: 'v3-33',
        answerId: 'v3-999',
      },
    );
    state.post.mockResolvedValue(204);
    localStorage.setItem(
      'chat-message-recording-v1:' +
        JSON.stringify([senderId, r.sourceCollection, 'room', 'message']),
      JSON.stringify(r),
    );
    await chatMessageRecording.flush();
    const body = {
      sourceCollection: r.sourceCollection,
      channelId: 'room',
      messageId: 'message',
      receiverUserId: r.receiverUserId,
      senderId,
      messageType: 'reservation',
      messageSubType: 'RESERVATION_CANCELLED',
      analyticsKind: 'user',
      isSystemMessage: false,
      sentAt: '2026-10-30T00:00:00.000Z',
      v3HairConsultationId: 33,
    };
    expect(state.post).toHaveBeenCalledWith(body, 'sender-token');
    expect(state.read.mock.calls[0][0].slice(1)).toEqual([
      r.sourceCollection,
      'room',
      'messages',
      'message',
    ]);
    expect(localStorage.length).toBe(0);
  },
);
it.each([
  { messageType: 'text', message: '대화를 시작했습니다.', kind: 'automatic' },
  { messageType: 'text', message: '대화를 시작했습니다.', analyticsKind: 'user', kind: 'user' },
  { messageType: 'unknown-future-type', analyticsKind: 'automatic', kind: 'automatic' },
  { messageType: 'review-special-reservation', analyticsKind: 'user', kind: 'user' },
])('records original type and classification: $messageType/$kind', async ({ kind, ...message }) => {
  state.user.id = 11;
  source(
    { senderId: '11', createdAt: at, ...message },
    {
      schemaVersion: 2,
      channelType: 'hairConsultation',
      postType: 'HAIR_CONSULTATION',
      postId: '123',
      answerId: '456',
    },
  );
  state.post.mockResolvedValue(204);
  recordAcceptedChatMessage(reference);
  await chatMessageRecording.flush();
  const body = state.post.mock.calls[0][0];
  expect(body).toMatchObject({ messageType: message.messageType, analyticsKind: kind });
  expect(body).not.toHaveProperty('v3HairConsultationId');
});
it('records system sender with the initiating participant session', async () => {
  state.user.id = 11;
  source({ senderId: 'system', messageType: 'system', createdAt: at, analyticsKind: 'automatic' });
  state.post.mockResolvedValue(204);
  recordAcceptedChatMessage({ ...reference, senderId: 'system', recordingUserId: '11' });
  await chatMessageRecording.flush();
  expect(state.post.mock.calls[0][0]).toMatchObject({
    senderId: 'system',
    isSystemMessage: true,
    analyticsKind: 'automatic',
    receiverUserId: 22,
  });
});
it.each(['pending', 'deleted', 'wrong-sender'])(
  'does not send an unaccepted source: %s',
  async (scenario) => {
    state.user.id = 11;
    source(
      {
        senderId: scenario === 'wrong-sender' ? '22' : '11',
        messageType: 'text',
        createdAt: at,
        ...(scenario === 'deleted' ? { deletedAt: at } : {}),
      },
      {},
      scenario === 'pending',
    );
    recordAcceptedChatMessage(reference);
    await chatMessageRecording.flush();
    expect(state.post).not.toHaveBeenCalled();
  },
);
