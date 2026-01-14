import type { InfiniteData } from '@tanstack/react-query';

import type { ApiListResponse } from '@/shared/api/client';

import type { CommentWithReplyStatus } from '../model/comment';

type CommentWithReplies = {
  replies?: CommentWithReplies[];
  [key: string]: unknown;
};

type TransformComment<T extends CommentWithReplies> = (
  comment: T,
  isReply: boolean,
) => CommentWithReplyStatus;

export default function convertToCommentWithReplyStatusCore<T extends CommentWithReplies>(
  data: InfiniteData<ApiListResponse<T>> | undefined,
  transformComment: TransformComment<T>,
): CommentWithReplyStatus[] {
  if (!data) return [];

  const seenIds = new Set<number>();
  const results: CommentWithReplyStatus[] = [];

  data.pages.forEach((page) => {
    page.dataList.forEach((comment) => {
      const commentId = comment.id as number;
      if (!seenIds.has(commentId)) {
        results.push(transformComment(comment, false));
        seenIds.add(commentId);
      }

      (comment.replies ?? []).forEach((reply) => {
        const replyId = (reply as T).id as number;
        if (!seenIds.has(replyId)) {
          results.push(transformComment(reply as T, true));
          seenIds.add(replyId);
        }
      });
    });
  });

  return results;
}
