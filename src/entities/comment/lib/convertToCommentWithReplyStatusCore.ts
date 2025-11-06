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

  return data.pages.flatMap((page) =>
    page.dataList.flatMap((comment) => [
      transformComment(comment, false),
      ...(comment.replies ?? []).map((reply) => transformComment(reply as T, true)),
    ]),
  );
}
