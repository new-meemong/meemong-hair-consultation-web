import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createChatMessageRecordingQueue,
  resolveChatMessageRecord,
  type RecordingSession,
} from './chat-message-recording-queue';

const record = {
  sourceCollection: 'hairConsultationChatChannels',
  channelId: 'original-room',
  messageId: 'original-message',
  senderId: '11',
  receiverUserId: 22,
};
const resolve = (r: Parameters<typeof resolveChatMessageRecord>[0]) =>
  resolveChatMessageRecord(
    r,
    { senderId: r.senderId, messageType: 'text' },
    {},
    '2026-10-30T00:00:00.000Z',
  );
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
      read: async (r) => resolve(r),
      post,
    });
    queue.enqueue(record);
    await queue.flush();
    expect(localStorage.length).toBe(1);
    expect(localStorage.getItem(localStorage.key(0)!)).not.toContain('token');
    await vi.advanceTimersByTimeAsync(30000);
    expect(post).toHaveBeenCalledTimes(2);
    expect(post.mock.calls[0]).toEqual(post.mock.calls[1]);
    expect(post.mock.calls[0][0]).toMatchObject({
      senderId: '11',
      messageType: 'text',
      analyticsKind: 'user',
      sentAt: '2026-10-30T00:00:00.000Z',
    });
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
      read: async (r) => (ready ? resolve(r) : 'pending'),
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
      read: async (r) => resolve(r),
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

it('drops rejected optional links once while preserving message metadata', async () => {
  const bodies: unknown[] = [];
  const queue = createChatMessageRecordingQueue({
    storage: () => localStorage,
    session: () => ({ id: '11', token: 'token' }),
    read: async (r) =>
      resolveChatMessageRecord(
        r,
        { senderId: r.senderId, messageType: 'text' },
        { thunderAnnouncementId: 33 },
        '2026-10-30T00:00:00.000Z',
      ),
    post: async (body) => {
      bodies.push({ ...body });
      return bodies.length === 1 ? 400 : 204;
    },
  });
  queue.enqueue(record);
  await queue.flush();
  expect(bodies).toHaveLength(2);
  expect(bodies[0]).toEqual({ ...(bodies[1] as object), thunderAnnouncementId: 33 });
  expect(localStorage.length).toBe(0);
  queue.dispose();
});

// Wire fields match Flutter ChatChannelIdentity.toFirestoreFields and the V3 room writer.
it.each([
  ['MODEL_ANNOUNCEMENT', '33', 'beautyApplicationId'],
  ['QUICK_MATCHING_PREMIUM', '33', 'thunderAnnouncementId'],
  ['QUICK_MATCHING_GENERAL', '33', 'thunderAnnouncementId'],
  ['REVIEW_SPECIAL', '33', 'timeSaleMenuId'],
  ['EXPERIENCE_GROUP', '33', undefined],
  ['HAIR_CONSULTATION', '33', undefined],
  ['HAIR_CONSULTATION', 'v3-33', 'v3HairConsultationId'],
  ['CHAT', '0', undefined],
  ['JOB_POSTING', '33', undefined],
  ['RESUME', '33', undefined],
])('links the actual room post type %s/%s', (postType, postId, field) => {
  const r: Parameters<typeof resolveChatMessageRecord>[0] = { ...record };
  const channelType =
    postType === 'HAIR_CONSULTATION'
      ? 'hairConsultation'
      : postType === 'REVIEW_SPECIAL'
        ? 'reviewSpecial'
        : ['JOB_POSTING', 'RESUME'].includes(postType!)
          ? 'jobPosting'
          : 'modelMatching';
  r.sourceCollection = {
    modelMatching: 'modelMatchingChatChannels',
    hairConsultation: 'hairConsultationChatChannels',
    reviewSpecial: 'reviewSpecialChatChannels',
    jobPosting: 'jobPostingChatChannels',
  }[channelType];
  expect(
    resolveChatMessageRecord(
      r,
      { senderId: '11', messageType: 'text' },
      {
        schemaVersion: 2,
        channelType,
        postType,
        postId,
        answerId: postType === 'HAIR_CONSULTATION' ? 'v3-999' : null,
        participantIds: ['11', '22'],
      },
      '2026-10-30T00:00:00.000Z',
    ),
  ).toBe('ready');
  const links = Object.fromEntries(
    Object.entries(r.body!).filter(([key]) =>
      [
        'beautyApplicationId',
        'thunderAnnouncementId',
        'v3HairConsultationId',
        'timeSaleMenuId',
      ].includes(key),
    ),
  );
  expect(links).toEqual(field ? { [field]: 33 } : {});
});
