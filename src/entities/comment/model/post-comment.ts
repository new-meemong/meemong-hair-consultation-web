import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

export type PostCommentUser = {
  userId: number;
  name: string;
  profilePictureURL: string | null;
  address?: string;
  companyName: string | null;
  role: ValueOf<typeof USER_ROLE>;
};

export type PostComment = {
  id: number;
  content: string;
  isVisibleToModel: boolean;
  createdAt: string;
  user: PostCommentUser;
  answerId: number;
  isConsultingAnswer: boolean;
  hasAnswerImages: boolean;
};

export type PostCommentWithReplies = PostComment & {
  replies: PostComment[];
};

export type PostCommentWithReplyStatus = PostComment & {
  isReply: boolean;
};
