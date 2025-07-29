import type { USER_ROLE } from '@/entities/user/constants/user-role';
import type { ValueOf } from '@/shared/type/types';

export type CommentUser = {
  userId: number;
  name: string;
  profileImageUrl: string | null;
  address?: string;
  role: ValueOf<typeof USER_ROLE>;
};

type Comment = {
  id: number;
  content: string;
  isVisibleToModel: boolean;
  createdAt: string;
  user: CommentUser;
};

export type CommentWithReplies = Comment & {
  replies: Comment[];
};

export type CommentWithReplyStatus = Comment & {
  isReply: boolean;
};
