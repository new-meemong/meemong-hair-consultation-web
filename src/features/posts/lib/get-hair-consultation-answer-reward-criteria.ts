import {
  HAIR_CONSULTATION_ANSWER_REWARD_PRESET_CODE,
  type HairConsultationAnswerRewardPresetCode,
  type MongRewardPreset,
} from '@/entities/mong/api/mong-reward-preset';

export type HairConsultationAnswerRewardCriterion = {
  label: string;
  presetCode: HairConsultationAnswerRewardPresetCode;
  rewardAmount: number | null;
};

const HAIR_CONSULTATION_ANSWER_REWARD_CRITERIA = [
  {
    label: '이미지 포함',
    presetCode: HAIR_CONSULTATION_ANSWER_REWARD_PRESET_CODE.WITH_STYLE_IMAGE,
  },
  {
    label: '이미지 미포함 · 성실작성',
    presetCode: HAIR_CONSULTATION_ANSWER_REWARD_PRESET_CODE.SINCERE_WITHOUT_STYLE_IMAGE,
  },
  {
    label: '이미지 미포함 · 성실작성 X',
    presetCode: HAIR_CONSULTATION_ANSWER_REWARD_PRESET_CODE.INSINCERE_WITHOUT_STYLE_IMAGE,
  },
] as const;

export function getHairConsultationAnswerRewardCriteria(
  presets: MongRewardPreset[] | undefined,
): HairConsultationAnswerRewardCriterion[] {
  return HAIR_CONSULTATION_ANSWER_REWARD_CRITERIA.map((criterion) => {
    const preset = presets?.find(
      ({ code, isActive, rewardType }) =>
        code === criterion.presetCode && isActive && rewardType === 'MONG',
    );

    return {
      ...criterion,
      rewardAmount: preset?.rewardAmount ?? null,
    };
  });
}

export function getHairConsultationAnswerRewardAmount(
  presets: MongRewardPreset[] | undefined,
  presetCode: HairConsultationAnswerRewardPresetCode,
): number | null {
  return (
    getHairConsultationAnswerRewardCriteria(presets).find(
      (criterion) => criterion.presetCode === presetCode,
    )?.rewardAmount ?? null
  );
}
