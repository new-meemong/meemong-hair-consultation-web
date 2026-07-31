import type { MongConsumePresetPaymentResult } from '@/entities/mong/api/mong-consume-preset';

export type CreateHairConsultationCommentResponse = {
  isReported: boolean;
  id: number;
  userId: number;
  hairConsultationId: number;
  content: string;
  parentCommentId: number | null;
  commentType: 'COMMENT' | 'REPLY';
  updatedAt: string;
  createdAt: string;
  mongConsumePreset: MongConsumePresetPaymentResult | null;
};
