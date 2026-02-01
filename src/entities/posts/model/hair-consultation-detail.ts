export type HairConsultationTreatment = {
  treatmentType: string;
  treatmentDate: string | null;
  isSelf: boolean;
  treatmentArea: string | null;
  decolorizationCount: number | null;
};

export type HairConsultationImage = {
  imageUrl: string;
};

export type HairConsultationMyImage = {
  imageUrl: string;
  subType: string;
};

export type HairConsultationDetail = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  contentUpdatedAt: string;
  desiredCostPrice: number;
  desiredDateType: string | null;
  desiredDate: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  hairConcerns: string[];
  hairLength: string | null;
  skinBrightness: string | null;
  hairTexture: string | null;
  personalColor: string | null;
  aspirationImageTypes: string[];
  aspirationImageDescription: string | null;
  hairConsultTreatmentDescription: string | null;
  treatment: HairConsultationTreatment | null;
  aspirationImages: HairConsultationImage[];
  myImages: HairConsultationMyImage[];
  isFavorited: boolean;
  isRead: boolean;
  hairConsultationCreateUserRegion: string | null;
  hairConsultationCreateUserId: number;
};
