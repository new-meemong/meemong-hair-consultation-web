import type { PostDetail } from '@/entities/posts/model/post-detail';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { HAIR_CONSULT_POSTING_QUERY_KEY_PREFIX } from '../constants/query-keys';

const GET_POST_DETAIL_ENDPOINT = `${HAIR_CONSULT_POSTING_QUERY_KEY_PREFIX}`;
export const getPostDetailQueryKey = (id: string) => [GET_POST_DETAIL_ENDPOINT, { id }];

export default function useGetPostDetail(id: string) {
  return useQuery({
    queryKey: getPostDetailQueryKey(id),
    queryFn: () => apiClient.get<PostDetail>(`${GET_POST_DETAIL_ENDPOINT}/${id}`),
    enabled: !!id,
  });
}
