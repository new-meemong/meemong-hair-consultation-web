import type { InfiniteData } from '@tanstack/react-query';

import type { ApiListResponse } from '@/shared/api/client';

import convertToCommentWithReplyStatusCore from './convertToCommentWithReplyStatusCore';
import type { CommentWithReplyStatus } from '../model/comment';
import type { ExperienceGroupCommentWithReplies } from '../model/experience-group-comment';
import { normalizeUserRole } from '@/entities/user/lib/user-role';


export default function convertToCommentWithReplyStatusFromExperienceGroup(
  data: InfiniteData<ApiListResponse<ExperienceGroupCommentWithReplies>> | undefined,
  isUserDesigner: boolean,
): CommentWithReplyStatus[] {
  return convertToCommentWithReplyStatusCore(data, (comment, isReply) => {
    const user = normalizeUserRole(comment.user);

    return {
      ...comment,
      isReply,
      isVisibleToModel: isUserDesigner,
      user: { ...user, userId: comment.user.id },
    };
  });
}
