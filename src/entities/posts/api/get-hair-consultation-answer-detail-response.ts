import type { HairConsultationAnswer } from '@/entities/posts/model/hair-consultation-answer';

export type HairConsultationAnswerDetailResponse = {
  data: {
    answer: HairConsultationAnswer;
    mongConsumePreset: Record<string, unknown> | null;
  };
};
