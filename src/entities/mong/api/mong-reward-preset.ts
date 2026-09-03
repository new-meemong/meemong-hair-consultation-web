export const HAIR_CONSULTATION_ANSWER_REWARD_PRESET_CODE = {
  WITH_STYLE_IMAGE: 'HAIR_CONSULTATIONS_ANSWER_EVENT',
  SINCERE_WITHOUT_STYLE_IMAGE: 'HAIR_CONSULTATIONS_ANSWER_EVENT_MISSING_STYLE_IMAGE',
  INSINCERE_WITHOUT_STYLE_IMAGE: 'HAIR_CONSULTATIONS_ANSWER_EVENT_SHORT_STYLE_DESCRIPTION',
} as const;

export type HairConsultationAnswerRewardPresetCode =
  (typeof HAIR_CONSULTATION_ANSWER_REWARD_PRESET_CODE)[keyof typeof HAIR_CONSULTATION_ANSWER_REWARD_PRESET_CODE];

export type MongRewardPreset = {
  id: number;
  code: string;
  title: string;
  description: string;
  isActive: boolean;
  rewardType: 'MONG' | (string & {});
  rewardAmount: number;
  repeatType: string;
  repeatCount: number;
  usedRepeatCount?: number;
  remainingRepeatCount?: number;
  createdAt: string;
  updatedAt: string;
};
