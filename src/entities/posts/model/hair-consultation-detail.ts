export type HairConsultationTreatment = {
  id: number;
  treatmentType: string;
  treatmentDate: string | null;
  isSelf: boolean | number;
  treatmentArea: string | null;
  decolorizationCount: number | null;
  displayOrder: number;
};

export type HairConsultationImage = {
  imageUrl: string;
};

export type HairConsultationMyImage = {
  imageUrl: string;
  subType: string;
};

export type HairConsultationModelImage = {
  id: number;
  imageURL: string;
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
  desiredDateDescription: string | null;
  desiredDate?: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  hairConcerns: string[] | null;
  hairLength: string | null;
  skinBrightness: string | null;
  hairTexture: string | null;
  personalColor: string | null;
  aspirationImageTypes: string[] | null;
  aspirationImageDescription: string | null;
  hairConsultTreatmentDescription: string | null;
  treatments: HairConsultationTreatment[] | null;
  aspirationImages: HairConsultationImage[] | null;
  myImages: HairConsultationMyImage[] | null;
  modelImages: HairConsultationModelImage[] | null;
  isFavorited: boolean;
  isRead: boolean;
  user: {
    id: number;
    address: string | null;
    displayName: string;
    profilePictureURL: string | null;
    sex?: string | number | null;
  };

  // Legacy-compatible fallback fields (optional)
  hairConsultationCreateUserRegion?: string | null;
  hairConsultationCreateUserId?: number;
  hairConsultationCreateUserSex?: string | number | null;
  hairConsultationCreateUserName?: string | null;
  hairConsultationCreateUserProfileImageUrl?: string | null;
  hairConsultationCreateUser?: {
    userId: number;
    name: string;
    profilePictureURL: string | null;
    sex?: string | number | null;
  } | null;
};
