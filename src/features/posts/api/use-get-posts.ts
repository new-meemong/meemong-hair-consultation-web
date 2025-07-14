import type { Post } from '@/entities/posts';
import { apiClient } from '@/shared/api/client';
import { filterUndefined } from '@/shared/lib/filter-undefined';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { TabType } from '../types/tabs';

export const GET_POSTS_ENDPOINT = 'hair-consult-postings/main';

type GetPostsQueryParams = {
  __limit?: number;
  filter?: TabType;
};

type GetPostsResponse = {
  hairConsultPostingList: Post[];
  nextCursor: string;
};

export function useGetPosts(params: GetPostsQueryParams) {
  const { __limit = 10, filter } = params;

  return useInfiniteQuery({
    queryKey: [GET_POSTS_ENDPOINT, { filter }],
    queryFn: ({ pageParam }) => {
      const searchParams = filterUndefined({
        __limit,
        __nextCursor: pageParam,
        filter,
      });

      return apiClient.get<GetPostsResponse>(GET_POSTS_ENDPOINT, {
        searchParams,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextCursor || undefined;
    },
    initialPageParam: undefined as string | undefined,
  });
}
