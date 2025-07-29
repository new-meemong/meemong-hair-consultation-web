import type { PostDetail } from '@/entities/posts/model/post-detail';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

const getGetPostDetailEndpoint = (id: string) => `${HAIR_CONSULT_POSTING_API_PREFIX}/${id}`;
export const getPostDetailQueryKeyPrefix = (id: string) => getGetPostDetailEndpoint(id);

export default function useGetPostDetail(id: string) {
  return useQuery({
    queryKey: [getPostDetailQueryKeyPrefix(id)],
    queryFn: () => apiClient.get<PostDetail>(getGetPostDetailEndpoint(id)),
    enabled: !!id,
  });
}
