import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { HairConsultationAnswerDetailResponse } from '@/entities/posts/api/get-hair-consultation-answer-detail-response';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

const getHairConsultationAnswerDetailEndpoint = (
  hairConsultationId: string,
  hairConsultationsAnswerId: string,
) => `${HAIR_CONSULTATION_API_PREFIX}/${hairConsultationId}/answers/${hairConsultationsAnswerId}`;

export const getHairConsultationAnswerDetailQueryKeyPrefix = (
  hairConsultationId: string,
  hairConsultationsAnswerId: string,
) => getHairConsultationAnswerDetailEndpoint(hairConsultationId, hairConsultationsAnswerId);

export default function useGetHairConsultationAnswerDetail(
  hairConsultationId: string,
  hairConsultationsAnswerId: string,
) {
  return useQuery({
    queryKey: [
      getHairConsultationAnswerDetailQueryKeyPrefix(hairConsultationId, hairConsultationsAnswerId),
    ],
    queryFn: () =>
      apiClient.get<HairConsultationAnswerDetailResponse>(
        getHairConsultationAnswerDetailEndpoint(hairConsultationId, hairConsultationsAnswerId),
      ),
    enabled: !!hairConsultationId && !!hairConsultationsAnswerId,
  });
}
