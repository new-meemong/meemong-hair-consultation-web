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
  isFavorited: boolean;
  isRead: boolean;
  hairConsultationCreateUserRegion: string;
  hairConsultationCreateUserId: number;
};
