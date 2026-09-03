import { describe, expect, it } from 'vitest';

import type { MongRewardPreset } from '@/entities/mong/api/mong-reward-preset';

import {
  getHairConsultationAnswerRewardAmount,
  getHairConsultationAnswerRewardCriteria,
} from './get-hair-consultation-answer-reward-criteria';

const createPreset = (
  overrides: Partial<MongRewardPreset> & Pick<MongRewardPreset, 'code' | 'rewardAmount'>,
): MongRewardPreset => ({
  id: 1,
  title: '헤어 상담 답변 보상',
  description: '헤어 상담 답변 보상',
  isActive: true,
  rewardType: 'MONG',
  repeatType: 'ID',
  repeatCount: 1,
  createdAt: '2026-09-03T00:00:00.000Z',
  updatedAt: '2026-09-03T00:00:00.000Z',
  ...overrides,
});

describe('getHairConsultationAnswerRewardCriteria', () => {
  it('서버 프리셋의 최신 리워드 금액을 지급 기준 순서로 매핑한다', () => {
    const criteria = getHairConsultationAnswerRewardCriteria([
      createPreset({
        code: 'HAIR_CONSULTATIONS_ANSWER_EVENT_SHORT_STYLE_DESCRIPTION',
        rewardAmount: 0,
      }),
      createPreset({
        code: 'HAIR_CONSULTATIONS_ANSWER_EVENT',
        rewardAmount: 6,
      }),
      createPreset({
        code: 'HAIR_CONSULTATIONS_ANSWER_EVENT_MISSING_STYLE_IMAGE',
        rewardAmount: 3,
      }),
    ]);

    expect(criteria.map(({ rewardAmount }) => rewardAmount)).toEqual([6, 3, 0]);
  });

  it('프리셋이 없거나 비활성·다른 보상 타입이면 하드코딩된 금액으로 대체하지 않는다', () => {
    const criteria = getHairConsultationAnswerRewardCriteria([
      createPreset({
        code: 'HAIR_CONSULTATIONS_ANSWER_EVENT',
        rewardAmount: 99,
        isActive: false,
      }),
      createPreset({
        code: 'HAIR_CONSULTATIONS_ANSWER_EVENT_MISSING_STYLE_IMAGE',
        rewardAmount: 99,
        rewardType: 'COUPON',
      }),
    ]);

    expect(criteria.map(({ rewardAmount }) => rewardAmount)).toEqual([null, null, null]);
  });

  it('배열 순서 대신 프리셋 코드로 리워드 금액을 찾는다', () => {
    const presets = [
      createPreset({
        code: 'HAIR_CONSULTATIONS_ANSWER_EVENT_MISSING_STYLE_IMAGE',
        rewardAmount: 3,
      }),
      createPreset({
        code: 'HAIR_CONSULTATIONS_ANSWER_EVENT',
        rewardAmount: 6,
      }),
    ];

    expect(getHairConsultationAnswerRewardAmount(presets, 'HAIR_CONSULTATIONS_ANSWER_EVENT')).toBe(
      6,
    );
  });
});
