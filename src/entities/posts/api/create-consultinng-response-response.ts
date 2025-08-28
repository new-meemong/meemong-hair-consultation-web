export type CreateConsultingResponseResponse = {
  data: {
    answer: {
      id: number;
      hairConsultPostingId: number;
      designerId: number;
      faceShape: string;
      hairType?: string;
      damageLevel?: string;
      bangsRecommendation: string;
      styleDescription: string;
      comment?: string;
      createdAt: string;
      updatedAt: string;
    };
    message: string;
  };
};
