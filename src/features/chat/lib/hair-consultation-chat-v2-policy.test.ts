import { describe, expect, it } from 'vitest';

import {
  buildHairConsultationLeaveMessage,
  canStartHairConsultationReplyRefundWait,
  isHairConsultationChatMessageSendUnavailable,
  resolveHairConsultationChatV2StartPointerId,
} from './hair-consultation-chat-v2-policy';

describe('hair consultation chat v2 policy', () => {
  it('삭제되었거나 상대방이 나간 메타는 전송 불가로 판정한다', () => {
    expect(isHairConsultationChatMessageSendUnavailable({ deletedAt: {} }, {})).toBe(true);
    expect(isHairConsultationChatMessageSendUnavailable({}, { otherUserLeft: true })).toBe(true);
    expect(isHairConsultationChatMessageSendUnavailable({}, {})).toBe(false);
  });

  it('받은 채팅을 몽으로 연 결제 타입만 첫 답장 환불 대기를 허용한다', () => {
    expect(
      canStartHairConsultationReplyRefundWait({
        isOpenUsingMong: true,
        billingCreateType: 'OPEN_RECEIVED_CHAT_DESIGNER',
      }),
    ).toBe(true);
    expect(
      canStartHairConsultationReplyRefundWait({
        openMethod: 'MONG',
        billingCreateType: 'FAVORITE_MODEL_CHAT',
      }),
    ).toBe(false);
    expect(
      canStartHairConsultationReplyRefundWait({
        openMethod: 'FREE_POLICY',
        billingCreateType: 'OPEN_RECEIVED_CHAT_DESIGNER',
      }),
    ).toBe(false);
  });

  it('Flutter와 같은 나가기 시스템 메시지를 만든다', () => {
    expect(buildHairConsultationLeaveMessage('문새')).toBe('문새님이\n채팅방을 나갔어요');
  });

  it('answerId와 숫자 정렬 참여자로 헤어상담 v2 포인터 ID를 만든다', () => {
    expect(
      resolveHairConsultationChatV2StartPointerId({
        schemaVersion: 2,
        channelType: 'hairConsultation',
        postType: 'HAIR_CONSULTATION',
        answerId: '42',
        participantIds: ['1000017555', '131224'],
      }),
    ).toBe('hairConsultation_HAIR_CONSULTATION_42_131224_1000017555');
  });

  it('레거시 또는 손상된 v2 채널은 포인터를 추정하지 않는다', () => {
    expect(
      resolveHairConsultationChatV2StartPointerId({
        channelType: 'hairConsultation',
        postType: 'HAIR_CONSULTATION',
        answerId: '42',
        participantIds: ['1', '2'],
      }),
    ).toBeNull();
    expect(
      resolveHairConsultationChatV2StartPointerId({
        schemaVersion: 2,
        channelType: 'hairConsultation',
        postType: 'HAIR_CONSULTATION',
        answerId: '42',
        participantIds: ['01', '2'],
      }),
    ).toBeNull();
  });
});
