import { useQuery } from '@tanstack/react-query';

import type { ConsultingResponse } from '@/entities/posts/model/consulting-response';
import { apiClient } from '@/shared/api/client';

import { HAIR_CONSULT_POSTING_API_PREFIX } from '../constants/api';

const getConsultingResponseEndpoint = (postId: string, responseId: string) =>
  `${HAIR_CONSULT_POSTING_API_PREFIX}/${postId}/consulting-answer/${responseId}`;

export default function useGetConsultingResponse(postId: string, responseId: string) {
  return useQuery({
    queryKey: [getConsultingResponseEndpoint(postId, responseId)],
    queryFn: () =>
      apiClient.get<ConsultingResponse>(getConsultingResponseEndpoint(postId, responseId)),
    enabled: !!postId,
  });
}
