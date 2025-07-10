import { Post } from '@/entities/posts';
import { apiClient } from '@/shared/api/client';
import { filterUndefined } from '@/shared/lib/filterUndefined';
import { useQuery } from '@tanstack/react-query';
import { TabType } from '../types/tabs';

const GET_POSTS_ENDPOINT = 'hair-consult-postings/main';

type GetPostsQueryParams = {
  __limit?: number;
  __nextCursor?: string;
  filter?: TabType;
};

type GetPostsResponse = {
  hairConsultPostingList: Post[];
  nextCursor: string;
};

export function useGetPosts(params: GetPostsQueryParams) {
  return useQuery({
    queryKey: [GET_POSTS_ENDPOINT, params],
    queryFn: () => {
      const searchParams = filterUndefined(params);

      return apiClient.get<GetPostsResponse>(GET_POSTS_ENDPOINT, {
        searchParams,
      });
    },
  });
}
