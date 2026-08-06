import { MEEMONG_PASS_CREATE_TYPES } from '@/features/ad-block/lib/meemong-pass-policy';

export function resolveModelHairConsultationResponseDetailChatCreateType(
  isMyHairConsultationPost: boolean,
) {
  return isMyHairConsultationPost
    ? null
    : MEEMONG_PASS_CREATE_TYPES.OTHER_HAIR_CONSULTATIONS_ANSWER_CHAT_MODEL;
}
