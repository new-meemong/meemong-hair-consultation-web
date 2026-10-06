import type { InfiniteData } from '@tanstack/react-query';

import type { ApiListResponse } from '@/shared/api/client';

import convertToCommentWithReplyStatusCore from './convertToCommentWithReplyStatusCore';
import type { CommentWithReplyStatus } from '../model/comment';
import type { ExperienceGroupCommentWithReplies } from '../model/experience-group-comment';
import { isModel, normalizeUserRole } from '@/entities/user/lib/user-role';

export default function convertToCommentWithReplyStatusFromExperienceGroup(
  data: InfiniteData<ApiListResponse<ExperienceGroupCommentWithReplies>> | undefined,
): CommentWithReplyStatus[] {
  return convertToCommentWithReplyStatusCore(data, (comment, isReply) => {
    const user = normalizeUserRole(comment.user);

    return {
      ...comment,
      isReply,
      // 공개 범위는 조회자가 아닌 작성자 기준이며, 역할이 없으면 기존 제한을 유지한다.
      isVisibleToModel: !isModel(user),
      user: { ...user, userId: comment.user.id },
    };
  });
}
