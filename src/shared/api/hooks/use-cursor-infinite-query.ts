import { Query, useInfiniteQuery, type InfiniteData, type QueryKey } from '@tanstack/react-query';

import type { ApiListResponse, ApiResponse } from '@/shared/api/client';
import { filterUndefined } from '@/shared/lib/filter-undefined';

import { apiClient } from '../client';
import { DEFAULT_LIMIT } from '../constants/default-limit';
import type { PagingQueryParams } from '../types/paging-query-params';

type UseCursorInfiniteQueryParams<TData extends Record<string, unknown>> = PagingQueryParams & {
  endpoint: string;
  queryKey: QueryKey;
  additionalParams?: Record<string, unknown>;
  select?: (
    data: InfiniteData<ApiListResponse<TData>, string | undefined>,
  ) => InfiniteData<ApiListResponse<TData>, string | undefined>;
  enabled?: boolean;
};

export default function useCursorInfiniteQuery<TData extends Record<string, unknown>>({
  __limit = DEFAULT_LIMIT,
  endpoint,
  queryKey,
  additionalParams,
  select,
  enabled = true,
}: UseCursorInfiniteQueryParams<TData>) {
  return useInfiniteQuery<
    ApiListResponse<TData>,
    Error,
    InfiniteData<ApiListResponse<TData>, string | undefined>,
    QueryKey,
    string | undefined
  >({
    queryKey,
    enabled,
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
    select,
    getNextPageParam: (lastPage: ApiListResponse<TData>) => {
      return lastPage.__nextCursor;
    },
    initialPageParam: undefined as string | undefined,
    meta: {
      skipLoadingOverlay: (
        query: Query<InfiniteData<ApiResponse<TData>, string | undefined>>,
      ) => {
        const isFetchingNextPage = (query.state.data?.pages?.length ?? 0) > 0;
        return isFetchingNextPage;
      },
    },
  });
}
