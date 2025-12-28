/**
 * 컨설팅 답변 시 몽 지급 정책 (Fallback 값)
 * 실제 값은 /api/v1/rewards API에서 가져옵니다.
 * - HAIR_CONSULT_ANSWER_EVENT: 이미지 첨부 시
 * - HAIR_CONSULT_ANSWER_EVENT_MISSING_STYLE_IMAGE: 이미지 없을 시
 */
export const CONSULTING_RESPONSE_REWARD = {
  /** 이미지 첨부 시 지급되는 몽 (Fallback) */
  WITH_IMAGE: 10,
  /** 일반 답변 시 지급되는 몽 (Fallback) */
  WITHOUT_IMAGE: 3,
} as const;
