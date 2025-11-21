import type { USER_ROLE } from '@/entities/user/constants/user-role';

import type { ValueOf } from '@/shared/type/types';

export type ExperienceGroupCommentUser = {
  id: number;
  displayName: string;
  profilePictureURL: string;
  role: ValueOf<typeof USER_ROLE>;
};

export type ExperienceGroupComment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: ExperienceGroupCommentUser;
  isAnonymous: boolean;
};

export type ExperienceGroupCommentWithReplies = ExperienceGroupComment & {
  replies: ExperienceGroupComment[];
};

export type ExperienceGroupCommentWithReplyStatus = ExperienceGroupComment & {
  isReply: boolean;
};
