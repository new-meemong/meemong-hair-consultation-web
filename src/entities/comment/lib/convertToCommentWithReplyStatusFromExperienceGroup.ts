import type { InfiniteData } from '@tanstack/react-query';

import type { ApiListResponse } from '@/shared/api/client';

import convertToCommentWithReplyStatusCore from './convertToCommentWithReplyStatusCore';
import type { CommentWithReplyStatus } from '../model/comment';
import type { ExperienceGroupCommentWithReplies } from '../model/experience-group-comment';


export default function convertToCommentWithReplyStatusFromExperienceGroup(
  data: InfiniteData<ApiListResponse<ExperienceGroupCommentWithReplies>> | undefined,
  isUserDesigner: boolean,
): CommentWithReplyStatus[] {
  return convertToCommentWithReplyStatusCore(data, (comment, isReply) => ({
    ...comment,
    isReply,
    isVisibleToModel: isUserDesigner,
    user: { ...comment.user, userId: comment.user.id },
  }));
}
