import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ committed: false, fail: false, record: vi.fn() }));
vi.mock('@/shared/lib/firebase', () => ({ db: {} }));
vi.mock('@/shared/lib/chat-message-recording', () => ({
  chatMessageRecording: { flush: async () => {} },
  recordAcceptedChatMessage: (...args: unknown[]) => {
    expect(state.committed).toBe(true);
    state.record(...args);
  },
}));
vi.mock('../api/update-designer-last-chat-received-at', () => ({
  updateDesignerLastChatReceivedAtAfterSend: async () => {},
}));
vi.mock('firebase/firestore', async (original) => ({
  ...(await original<typeof import('firebase/firestore')>()),
  collection: (...parts: unknown[]) => parts,
  doc: () => ({ id: 'persisted-message' }),
  runTransaction: async (_db: unknown, action: (tx: unknown) => Promise<unknown>) => {
    await action({
      get: async () => ({
        exists: () => true,
        data: () => ({ schemaVersion: 2, channelOpenUserId: '11' }),
      }),
      set: () => {},
      update: () => {},
    });
    if (state.fail) throw new Error('write rejected');
    state.committed = true;
  },
}));
import { useHairConsultationChatMessageStore } from './hair-consultation-chat-message-store';
import { HairConsultationChatMessageTypeEnum } from '../type/hair-consultation-chat-message-type';

afterEach(() => {
  state.committed = false;
  state.fail = false;
  state.record.mockClear();
});
it.each(['11', '22'])('records only after accepted Firestore send from %s', async (senderId) => {
  const receiverId = senderId === '11' ? '22' : '11';
  const result = await useHairConsultationChatMessageStore
    .getState()
    .sendMessage({
      channelId: 'room',
      senderId,
      receiverId,
      message: 'hello',
      messageType: HairConsultationChatMessageTypeEnum.TEXT,
    });
  expect(result.success).toBe(true);
  expect(state.record).toHaveBeenCalledWith(
    {
      sourceCollection: 'hairConsultationChatChannels',
      channelId: 'room',
      messageId: 'persisted-message',
      senderId,
      receiverUserId: Number(receiverId),
    },
    'text',
  );
});
it('does not record failed Firestore writes', async () => {
  state.fail = true;
  const result = await useHairConsultationChatMessageStore
    .getState()
    .sendMessage({
      channelId: 'room',
      senderId: '11',
      receiverId: '22',
      message: 'hello',
      messageType: HairConsultationChatMessageTypeEnum.TEXT,
    });
  expect(result.success).toBe(false);
  expect(state.record).not.toHaveBeenCalled();
});
