import type { HairConsultationAnswer } from '@/entities/posts/model/hair-consultation-answer';
import type { MongConsumePresetPaymentResult } from '@/entities/mong/api/mong-consume-preset';

export type HairConsultationAnswerDetailResponse = HairConsultationAnswer & {
  mongConsumePreset: MongConsumePresetPaymentResult | null;
};
