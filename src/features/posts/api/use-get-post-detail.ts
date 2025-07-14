import type { PostDetail } from '@/entities/posts/model/types';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

export const GET_POST_DETAIL_ENDPOINT = 'hair-consult-postings';

function useGetPostDetail(id: string) {
  return useQuery({
    queryKey: [GET_POST_DETAIL_ENDPOINT, { id }],
    queryFn: () => apiClient.get<PostDetail>(`${GET_POST_DETAIL_ENDPOINT}/${id}`),
    enabled: !!id,
  });
}

export default useGetPostDetail;
