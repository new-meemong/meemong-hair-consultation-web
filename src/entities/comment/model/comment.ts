import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

export type CommentUser = {
  userId: number;
  displayName: string;
  profilePictureURL: string | null;
  address?: string;
  companyName?: string | null;
  role: ValueOf<typeof USER_ROLE>;
};

export type Comment = {
  id: number;
  content: string;
  isVisibleToModel: boolean;
  createdAt: string;
  updatedAt?: string;
  user: CommentUser;
  isAnonymou?: boolean;
  answerId?: number;
  isConsultingAnswer?: boolean;
  hasAnswerImages?: boolean;
};

export type CommentWithReplies = Comment & {
  replies: Comment[];
};

export type CommentWithReplyStatus = Comment & {
  isReply: boolean;
};
