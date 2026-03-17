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
  mongConsumePreset: {
    id: number;
    title: string;
    type: string;
    subType: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isPaidThisTime: boolean;
  } | null;
};
