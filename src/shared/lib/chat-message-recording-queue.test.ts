import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createChatMessageRecordingQueue,
  type RecordingSession,
} from './chat-message-recording-queue';

const record = {
  sourceCollection: 'hairConsultationChatChannels',
  channelId: 'original-room',
  messageId: 'original-message',
  senderId: '11',
  receiverUserId: 22,
};
afterEach(() => {
  localStorage.clear();
  vi.useRealTimers();
});
describe('accepted chat recording outbox', () => {
  it('persists identical references for server failure and clears after 204', async () => {
    vi.useFakeTimers();
    const post = vi.fn().mockResolvedValueOnce(503).mockResolvedValue(204);
    const queue = createChatMessageRecordingQueue({
      storage: () => localStorage,
      session: () => ({ id: '11', token: 'original-token' }),
      read: async () => 'ready',
      post,
    });
    queue.enqueue(record);
    await queue.flush();
    expect(localStorage.length).toBe(1);
    expect(localStorage.getItem(localStorage.key(0)!)).not.toContain('token');
    await vi.advanceTimersByTimeAsync(30000);
    expect(post).toHaveBeenCalledTimes(2);
    expect(post.mock.calls[0]).toEqual(post.mock.calls[1]);
    expect(post.mock.calls[0][0]).not.toHaveProperty('senderId');
    expect(localStorage.length).toBe(0);
    queue.dispose();
  });
  it('waits for timestamp confirmation and never uses another account token', async () => {
    vi.useFakeTimers();
    let owner: RecordingSession = { id: '11', token: 'first' };
    let ready = false;
    const post = vi.fn().mockResolvedValue(204);
    const queue = createChatMessageRecordingQueue({
      storage: () => localStorage,
      session: () => owner,
      read: async () => (ready ? 'ready' : 'pending'),
      post,
    });
    queue.enqueue(record);
    await queue.flush();
    expect(post).not.toHaveBeenCalled();
    owner = { id: '22', token: 'other' };
    ready = true;
    await queue.flush();
    expect(post).not.toHaveBeenCalled();
    owner = { id: '11', token: 'renewed' };
    await queue.flush();
    expect(post.mock.calls[0][1]).toEqual(owner);
    expect(localStorage.length).toBe(0);
    queue.dispose();
  });
  it.each([400, 403, 404])('does not repeat permanent status %s', async (status) => {
    const post = vi.fn().mockResolvedValue(status);
    const queue = createChatMessageRecordingQueue({
      storage: () => localStorage,
      session: () => ({ id: '11', token: 'token' }),
      read: async () => 'ready',
      post,
    });
    queue.enqueue(record);
    await queue.flush();
    await queue.flush();
    expect(post).toHaveBeenCalledTimes(1);
    expect(localStorage.length).toBe(0);
    queue.dispose();
  });
});
