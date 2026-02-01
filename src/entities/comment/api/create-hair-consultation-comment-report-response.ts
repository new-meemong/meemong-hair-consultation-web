export type HairConsultationCommentReport = {
  id: number;
  userId: number;
  hairConsultationId: number;
  hairConsultationCommentId: number;
  status: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateHairConsultationCommentReportResponse = {
  data: HairConsultationCommentReport;
};
