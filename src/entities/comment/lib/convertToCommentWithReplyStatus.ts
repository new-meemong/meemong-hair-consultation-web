import type { InfiniteData } from '@tanstack/react-query';

import type { ApiListResponse } from '../../../shared/api/client';
import type { CommentWithReplyStatus } from '../model/comment';
import type { PostCommentWithReplies } from '../model/post-comment';

import convertToCommentWithReplyStatusCore from './convertToCommentWithReplyStatusCore';

export default function convertToCommentWithReplyStatusFromPostComment(
  data: InfiniteData<ApiListResponse<PostCommentWithReplies>> | undefined,
): CommentWithReplyStatus[] {
  return convertToCommentWithReplyStatusCore(data, (comment, isReply) => ({
    ...comment,
    isReply,
    user: { ...comment.user, displayName: comment.user.name },
  }));
}
