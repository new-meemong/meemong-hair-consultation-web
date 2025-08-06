import type { Post } from '@/entities/posts';
import { DEFAULT_LIMIT } from '@/shared/api/constants/default-limit';
import useCursorInfiniteQuery from '@/shared/api/hooks/use-cursor-infinite-query';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';
import type { PagingResponse } from '@/shared/api/types/paging-response';

import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';
import type { PostListTab } from '../types/post-list-tab';

const GET_POSTS_QUERY_ENDPOINT = `${HAIR_CONSULT_POSTING_API_PREFIX}/main`;
export const getPostsQueryKeyPrefix = () => GET_POSTS_QUERY_ENDPOINT;

type GetPostsQueryParams = PagingQueryParams & {
  filter?: PostListTab;
};

type GetPostsResponse = PagingResponse & {
  hairConsultPostingList: Post[];
};

export default function useGetPosts(params: GetPostsQueryParams) {
  const { __limit = DEFAULT_LIMIT, filter } = params;

  return useCursorInfiniteQuery<GetPostsResponse>({
    endpoint: GET_POSTS_QUERY_ENDPOINT,
    queryKey: [getPostsQueryKeyPrefix(), params],
    __limit,
    additionalParams: {
      filter,
    },
  });
}
