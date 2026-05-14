import type { InfiniteData } from '@tanstack/react-query';

import convertToCommentWithReplyStatusCore from './convertToCommentWithReplyStatusCore';
import type { ApiListResponse } from '../../../shared/api/client';
import type { CommentWithReplyStatus } from '../model/comment';
import type { PostCommentWithReplies } from '../model/post-comment';
import { normalizeUserRole } from '@/entities/user/lib/user-role';


export default function convertToCommentWithReplyStatusFromPostComment(
  data: InfiniteData<ApiListResponse<PostCommentWithReplies>> | undefined,
): CommentWithReplyStatus[] {
  return convertToCommentWithReplyStatusCore(data, (comment, isReply) => {
    const user = normalizeUserRole(comment.user);

    return {
      ...comment,
      isReply,
      user: { ...user, displayName: comment.user.name },
    };
  });
}
