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

afterEach(() => {
  chatMessageRecording.dispose();
  localStorage.clear();
  vi.clearAllMocks();
});
it('confirms original Firestore document then sends references through authenticated API', async () => {
  state.read.mockResolvedValue({
    exists: () => true,
    metadata: { hasPendingWrites: false },
    data: () => ({ senderId: '11', messageType: 'text', createdAt: Timestamp.now() }),
  });
  state.post.mockResolvedValue(204);
  const record = {
    sourceCollection: 'hairConsultationChatChannels',
    channelId: 'room',
    messageId: 'message',
    senderId: '11',
    receiverUserId: 22,
  };
  recordAcceptedChatMessage(record, 'text');
  await chatMessageRecording.flush();
  expect(state.read.mock.calls[0][0].slice(1)).toEqual([
    'hairConsultationChatChannels',
    'room',
    'messages',
    'message',
  ]);
  expect(state.post).toHaveBeenCalledWith(
    {
      sourceCollection: record.sourceCollection,
      channelId: 'room',
      messageId: 'message',
      receiverUserId: 22,
    },
    'sender-token',
  );
  expect(localStorage.length).toBe(0);
});
it('does not register automatic, system or deleted messages', async () => {
  const record = {
    sourceCollection: 'hairConsultationChatChannels',
    channelId: 'room',
    messageId: 'message',
    senderId: '11',
    receiverUserId: 22,
  };
  recordAcceptedChatMessage(record, 'text', true);
  recordAcceptedChatMessage(record, 'system');
  state.read.mockResolvedValue({
    exists: () => true,
    metadata: { hasPendingWrites: false },
    data: () => ({ senderId: '11', messageType: 'text', deletedAt: Timestamp.now() }),
  });
  recordAcceptedChatMessage(record, 'text');
  await chatMessageRecording.flush();
  expect(state.post).not.toHaveBeenCalled();
  expect(localStorage.length).toBe(0);
});
