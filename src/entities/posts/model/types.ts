export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export type Post = {
  id: number;
  title: string;
  content: string;
  repImageUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  isFavorited: boolean;
  hairConsultPostingCreateUserName: string;
  hairConsultPostingCreateUserRegion: string;
  minPaymentPrice: number | null;
  maxPaymentPrice: number | null;
};

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
}
