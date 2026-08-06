import { describe, expect, it } from 'vitest';

import { resolveChatV2MessageStateTransition } from './chat-v2-message-state-transition';

const baseParams = {
  messageType: 'text',
  senderId: '2',
  channelOpenUserId: '1',
  channelHasFirstReply: false,
  senderCanAwaitReplyRefund: true,
  senderIsRefunded: false,
  receiverAwaitingReply: false,
};

describe('resolveChatV2MessageStateTransition', () => {
  it.each(['text', 'image', 'file'])('%s 첫 답장은 환불 대기를 시작한다', (messageType) => {
    expect(resolveChatV2MessageStateTransition({ ...baseParams, messageType })).toEqual({
      marksFirstReply: true,
      startsSenderAwaitingReply: true,
      clearsReceiverAwaitingReply: false,
    });
  });

  it('시스템 메시지는 첫 답장이나 환불 상태를 바꾸지 않는다', () => {
    expect(
      resolveChatV2MessageStateTransition({
        ...baseParams,
        messageType: 'system',
        receiverAwaitingReply: true,
      }),
    ).toEqual({
      marksFirstReply: false,
      startsSenderAwaitingReply: false,
      clearsReceiverAwaitingReply: false,
    });
  });

  it('개설자의 사용자 메시지는 상대방의 환불 대기를 해제한다', () => {
    expect(
      resolveChatV2MessageStateTransition({
        ...baseParams,
        senderId: '1',
        receiverAwaitingReply: true,
      }),
    ).toEqual({
      marksFirstReply: false,
      startsSenderAwaitingReply: false,
      clearsReceiverAwaitingReply: true,
    });
  });

  it('무료 개봉 또는 환불 완료 상태에서는 첫 답장이어도 환불 대기를 시작하지 않는다', () => {
    expect(
      resolveChatV2MessageStateTransition({
        ...baseParams,
        senderCanAwaitReplyRefund: false,
      }).startsSenderAwaitingReply,
    ).toBe(false);
    expect(
      resolveChatV2MessageStateTransition({
        ...baseParams,
        senderIsRefunded: true,
      }).startsSenderAwaitingReply,
    ).toBe(false);
  });

  it('이미 첫 답장이 기록된 방에서는 latch를 다시 올리지 않는다', () => {
    expect(
      resolveChatV2MessageStateTransition({
        ...baseParams,
        channelHasFirstReply: true,
      }).marksFirstReply,
    ).toBe(false);
  });
});
