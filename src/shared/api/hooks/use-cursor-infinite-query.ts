import { Query, useInfiniteQuery, type QueryKey } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/client';
import { filterUndefined } from '@/shared/lib/filter-undefined';

import { apiClient } from '../client';
import { DEFAULT_LIMIT } from '../constants/default-limit';
import type { GetInfiniteData } from '../types/get-infinite-data';
import type { PagingQueryParams } from '../types/paging-query-params';

type UseCursorInfiniteQueryParams = PagingQueryParams & {
  endpoint: string;
  queryKey: QueryKey;
  additionalParams?: Record<string, unknown>;
};

export default function useCursorInfiniteQuery<TData extends Record<string, unknown>>({
  __limit = DEFAULT_LIMIT,
  endpoint,
  queryKey,
  additionalParams,
}: UseCursorInfiniteQueryParams) {
  return useInfiniteQuery<ApiListResponse<TData>, Error>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const searchParams = filterUndefined({
        __limit,
        __nextCursor: pageParam as string,
        ...additionalParams,
      });

      const params = new URLSearchParams();
      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(`${key}[]`, String(v)));
          } else if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }

      return apiClient.getList<TData>(endpoint, {
        searchParams: params,
      });
    },
    getNextPageParam: (lastPage: ApiListResponse<TData>) => {
      return lastPage.nextCursor ?? lastPage.__nextCursor;
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
