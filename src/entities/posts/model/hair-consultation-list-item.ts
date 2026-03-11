type HairConsultationListTreatment = {
  id: number;
  treatmentType: string;
  treatmentDate: string | null;
  isSelf: boolean | number;
  treatmentArea: string | null;
  decolorizationCount: number | null;
  displayOrder: number;
};

export type HairConsultationListItem = {
  id: number;
  title: string;
  content: string;
  desiredCostPrice: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  contentUpdatedAt: string;
  treatments: HairConsultationListTreatment[];
  isFavorited: boolean;
  isRead: boolean;
  brandIds?: number[];
  brands?: {
    id: number;
    logoImageURL: string;
  }[];
  user: {
    id: number;
    address: string | null;
  };
};
