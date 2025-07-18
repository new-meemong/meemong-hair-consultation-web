export type PostDetail = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  images: string[];
  isFavorited: boolean;
  likeCount: number;
  commentCount: number;
  isPhotoVisibleToDesigner: boolean;
  hairConsultPostingCreateUserName: string;
  hairConsultPostingCreateUserProfileImageUrl: string | null;
  hairConsultPostingCreateUserRegion: string | null;
  hairConsultPostingCreateUserId: number;
};
