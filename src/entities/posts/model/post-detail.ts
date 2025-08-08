import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

export type PostDetail = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
  isFavorited: boolean;
  likeCount: number;
  commentCount: number;
  isPhotoVisibleToDesigner: boolean;
  hairConsultPostingCreateUserName: string;
  hairConsultPostingCreateUserProfileImageUrl: string | null;
  hairConsultPostingCreateUserRegion: string | null;
  hairConsultPostingCreateUserRole: ValueOf<typeof USER_ROLE>;
  hairConsultPostingCreateUserId: number;
};
