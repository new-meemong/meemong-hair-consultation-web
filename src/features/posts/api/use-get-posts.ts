import type { Post } from '@/entities/posts';
import type { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';

import type { SelectedRegion } from '@/features/region/types/selected-region';

import { DEFAULT_LIMIT } from '@/shared/api/constants/default-limit';
import useCursorInfiniteQuery from '@/shared/api/hooks/use-cursor-infinite-query';
import convertToAddresses from '@/shared/api/lib/convert-to-addresses';
import type { PagingQueryParams } from '@/shared/api/types/paging-query-params';
import type { ValueOf } from '@/shared/type/types';

import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';
import type { PostListTab } from '../types/post-list-tab';

const GET_POSTS_QUERY_ENDPOINT = `${HAIR_CONSULT_POSTING_API_PREFIX}/main`;
export const getPostsQueryKeyPrefix = () => GET_POSTS_QUERY_ENDPOINT;

type GetPostsQueryParams = PagingQueryParams & {
  filter?: PostListTab;
  consultType: ValueOf<typeof CONSULT_TYPE>;
  selectedRegion: SelectedRegion | null;
};

export default function useGetPosts(params: GetPostsQueryParams) {
  const { __limit = DEFAULT_LIMIT, filter, consultType, selectedRegion } = params;

  return useCursorInfiniteQuery<Post>({
    endpoint: GET_POSTS_QUERY_ENDPOINT,
    queryKey: [getPostsQueryKeyPrefix(), params],
    __limit,
    additionalParams: {
      filter,
      consultType,
      addresses: convertToAddresses(selectedRegion),
    },
  });
}
