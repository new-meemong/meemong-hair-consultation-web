import { describe, expect, it } from 'vitest';

import { resolveModelHairConsultationResponseDetailChatCreateType } from './hair-consultation-chat-billing-policy';

describe('hair consultation chat billing policy', () => {
  it('과금한 내 헤어컨설팅 답변 상세의 추가상담은 재차감하지 않는다', () => {
    expect(resolveModelHairConsultationResponseDetailChatCreateType(true)).toBeNull();
  });

  it('타인 헤어컨설팅 답변 상담은 타인 글 10몽 타입을 선택한다', () => {
    expect(resolveModelHairConsultationResponseDetailChatCreateType(false)).toBe(
      'OTHER_HAIR_CONSULTATIONS_ANSWER_CHAT_MODEL',
    );
  });
});
