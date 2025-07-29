import type { Post } from '@/entities/posts';
import { apiClient } from '@/shared/api/client';
import { filterUndefined } from '@/shared/lib/filter-undefined';
import { useInfiniteQuery, type Query } from '@tanstack/react-query';
import type { PostListTab } from '../types/post-list-tab';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';
import type { PagingResponse } from '@/shared/api/types/paging-response';

const GET_POSTS_QUERY_ENDPOINT = `${HAIR_CONSULT_POSTING_API_PREFIX}/main`;
export const getPostsQueryKeyPrefix = () => GET_POSTS_QUERY_ENDPOINT;

type GetPostsQueryParams = PagingQueryParams & {
  filter?: PostListTab;
};

type GetPostsResponse = PagingResponse & {
  hairConsultPostingList: Post[];
};

type GetPostsInfiniteData = {
  pages: GetPostsResponse[];
  pageParams: (string | undefined)[];
};

export default function useGetPosts(params: GetPostsQueryParams) {
  const { __limit = 20, filter } = params;

  return useInfiniteQuery({
    queryKey: [getPostsQueryKeyPrefix(), params],
    queryFn: ({ pageParam }) => {
      const searchParams = filterUndefined({
        __limit,
        __nextCursor: pageParam,
        filter,
      });

      return apiClient.get<GetPostsResponse>(GET_POSTS_QUERY_ENDPOINT, {
        searchParams,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextCursor || undefined;
    },
    initialPageParam: undefined as string | undefined,
    meta: {
      skipLoadingOverlay: (query: Query<GetPostsInfiniteData>) => {
        const isFetchingNextPage = (query.state.data?.pages?.length ?? 0) > 0;
        return isFetchingNextPage;
      },
    },
  });
}
