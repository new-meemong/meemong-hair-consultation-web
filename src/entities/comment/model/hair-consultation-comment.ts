import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

export type HairConsultationCommentUser = {
  id: number;
  displayName: string;
  profilePictureURL: string | null;
  address: string | null;
  companyName: string | null;
  role: ValueOf<typeof USER_ROLE>;
};

export type HairConsultationComment = {
  id: number;
  content: string;
  commentType: 'COMMENT' | 'REPLY';
  createdAt: string;
  updatedAt: string;
  user: HairConsultationCommentUser;
};

export type HairConsultationCommentWithReplies = HairConsultationComment & {
  replies: HairConsultationComment[];
};
