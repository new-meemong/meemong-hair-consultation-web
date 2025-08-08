import { Query, useInfiniteQuery, type QueryKey } from '@tanstack/react-query';

import type { ApiResponse } from '@/shared/api/client';
import { filterUndefined } from '@/shared/lib/filter-undefined';

import { apiClient } from '../client';
import { DEFAULT_LIMIT } from '../constants/default-limit';
import type { GetInfiniteData } from '../types/get-infinite-data';
import type { PagingQueryParams } from '../types/paging-query-params';
import type { PagingResponse } from '../types/paging-response';




type UseCursorInfiniteQueryParams = PagingQueryParams & {
  endpoint: string;
  queryKey: QueryKey;
  additionalParams?: Record<string, unknown>;
};

export default function useCursorInfiniteQuery<TData extends PagingResponse>({
  __limit = DEFAULT_LIMIT,
  endpoint,
  queryKey,
  additionalParams,
}: UseCursorInfiniteQueryParams) {
  return useInfiniteQuery<ApiResponse<TData>, Error>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const searchParams = filterUndefined({
        __limit,
        __nextCursor: pageParam as string,
        ...additionalParams,
      });

      return apiClient.get<TData>(endpoint, {
        searchParams,
      });
    },
    getNextPageParam: (lastPage: ApiResponse<TData>) => {
      return lastPage.data.nextCursor || undefined;
    },
    initialPageParam: undefined as string | undefined,
    meta: {
      skipLoadingOverlay: (query: Query<GetInfiniteData<ApiResponse<TData>>>) => {
        const isFetchingNextPage = (query.state.data?.pages?.length ?? 0) > 0;
        return isFetchingNextPage;
      },
    },
  });
}
