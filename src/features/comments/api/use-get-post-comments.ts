import type { CommentWithReplies } from '@/entities/comment/model/comment';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '@/features/posts/constants/api';
import { DEFAULT_LIMIT } from '@/shared/api/constants/default-limit';
import useCursorInfiniteQuery from '@/shared/api/hooks/use-cursor-infinite-query';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';
import type { PagingResponse } from '@/shared/api/types/paging-response';

const getGetPostCommentsEndpoint = (postId: string) =>
  `${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}/comments`;
export const getGetPostCommentsQueryKeyPrefix = (postId: string) =>
  getGetPostCommentsEndpoint(postId);

type GetPostCommentsResponse = PagingResponse & {
  comments: CommentWithReplies[];
};

export default function useGetPostComments(postId: string, params: PagingQueryParams = {}) {
  const { __limit = DEFAULT_LIMIT } = params;

  return useCursorInfiniteQuery<GetPostCommentsResponse>({
    endpoint: getGetPostCommentsEndpoint(postId),
    queryKey: [getGetPostCommentsQueryKeyPrefix(postId), params],
    __limit,
  });
}
