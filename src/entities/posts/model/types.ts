export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  repImageUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  isFavorited: boolean;
  hairConsultPostingCreateUserName: string;
  hairConsultPostingCreateUserRegion: string;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  images: string[];
  isFavorited: boolean;
  likeCount: number;
  commentCount: number;
  hairConsultPostingCreateUserName: string;
  hairConsultPostingCreateUserProfileImageUrl: string | null;
  hairConsultPostingCreateUserRegion: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
}
