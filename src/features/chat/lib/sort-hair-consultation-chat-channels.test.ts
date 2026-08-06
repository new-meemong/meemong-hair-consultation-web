import { describe, expect, it } from 'vitest';

import { sortHairConsultationChatChannels } from './sort-hair-consultation-chat-channels';

const timestamp = (millis: number) => ({ toMillis: () => millis });

describe('sortHairConsultationChatChannels', () => {
  it('메시지가 없는 신규 v2 방도 lastActivityAt 기준으로 위에 표시한다', () => {
    const channels = [
      {
        channelId: 'legacy',
        lastMessage: { updatedAt: timestamp(100) },
        createdAt: timestamp(50),
      },
      {
        channelId: 'v2-new',
        lastActivityAt: timestamp(200),
        lastMessage: {},
        createdAt: timestamp(200),
      },
    ];

    expect(sortHairConsultationChatChannels(channels).map(({ channelId }) => channelId)).toEqual([
      'v2-new',
      'legacy',
    ]);
  });

  it('lastActivityAt이 없는 레거시 방은 마지막 메시지 시각으로 정렬한다', () => {
    const channels = [
      { channelId: 'older', lastMessage: { updatedAt: timestamp(100) } },
      { channelId: 'newer', lastMessage: { updatedAt: timestamp(300) } },
    ];

    expect(sortHairConsultationChatChannels(channels).map(({ channelId }) => channelId)).toEqual([
      'newer',
      'older',
    ]);
  });

  it('읽음 처리로 updatedAt만 바뀐 방은 목록 상단으로 이동시키지 않는다', () => {
    const channels = [
      {
        channelId: 'recent-activity',
        lastActivityAt: timestamp(300),
        updatedAt: timestamp(300),
      },
      {
        channelId: 'recently-read',
        lastActivityAt: timestamp(100),
        updatedAt: timestamp(500),
      },
    ];

    expect(sortHairConsultationChatChannels(channels).map(({ channelId }) => channelId)).toEqual([
      'recent-activity',
      'recently-read',
    ]);
  });

  it('고정 방을 먼저 표시하고 입력 배열은 변경하지 않는다', () => {
    const channels = [
      { channelId: 'recent', lastActivityAt: timestamp(500) },
      {
        channelId: 'pinned-older',
        isPinned: true,
        pinnedAt: timestamp(100),
        lastActivityAt: timestamp(50),
      },
      {
        channelId: 'pinned-newer',
        isPinned: true,
        pinnedAt: timestamp(200),
        lastActivityAt: timestamp(10),
      },
    ];

    expect(sortHairConsultationChatChannels(channels).map(({ channelId }) => channelId)).toEqual([
      'pinned-newer',
      'pinned-older',
      'recent',
    ]);
    expect(channels.map(({ channelId }) => channelId)).toEqual([
      'recent',
      'pinned-older',
      'pinned-newer',
    ]);
  });
});
