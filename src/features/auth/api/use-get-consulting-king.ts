import { useQuery } from '@tanstack/react-query';

import type { GetConsultingKingResponse } from '@/entities/user/model/get-consulting-king-response';
import { HAIR_CONSULT_POSTING_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';

const GET_CONSULTING_KING_ENDPOINT = `${HAIR_CONSULT_POSTING_API_PREFIX}/consulting-king`;
export const getConsultingKingQueryKeyPrefix = () => GET_CONSULTING_KING_ENDPOINT;

export default function useGetConsultingKing() {
  return useQuery({
    queryKey: [getConsultingKingQueryKeyPrefix()],
    queryFn: () => apiClient.get<GetConsultingKingResponse>(GET_CONSULTING_KING_ENDPOINT),
  });
}
