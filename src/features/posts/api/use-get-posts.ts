import type { Post } from '@/entities/posts';
import { apiClient } from '@/shared/api/client';
import { filterUndefined } from '@/shared/lib/filter-undefined';
import { useInfiniteQuery, type Query } from '@tanstack/react-query';
import type { TabType } from '../types/tabs';
import { HAIR_CONSULT_POSTING_QUERY_KEY_PREFIX } from '../constants/query-keys';

const GET_POSTS_QUERY_KEY_PREFIX = `${HAIR_CONSULT_POSTING_QUERY_KEY_PREFIX}/main`;
export const getGetPostsQueryKey = () => [GET_POSTS_QUERY_KEY_PREFIX];

type GetPostsQueryParams = {
  __limit?: number;
  filter?: TabType;
};

type GetPostsResponse = {
  hairConsultPostingList: Post[];
  nextCursor: string;
};

type GetPostsInfiniteData = {
  pages: GetPostsResponse[];
  pageParams: (string | undefined)[];
};

export default function useGetPosts(params: GetPostsQueryParams) {
  const { __limit = 10, filter } = params;

  return useInfiniteQuery({
    queryKey: [GET_POSTS_QUERY_KEY_PREFIX, params],
    queryFn: ({ pageParam }) => {
      const searchParams = filterUndefined({
        __limit,
        __nextCursor: pageParam,
        filter,
      });

      return apiClient.get<GetPostsResponse>(GET_POSTS_QUERY_KEY_PREFIX, {
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
