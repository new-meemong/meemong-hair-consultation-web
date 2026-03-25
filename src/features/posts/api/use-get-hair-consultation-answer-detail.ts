import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { HairConsultationAnswerDetailResponse } from '@/entities/posts/api/get-hair-consultation-answer-detail-response';
import { useQuery } from '@tanstack/react-query';
import { useContextualApiClient } from '@/shared/api/hooks/use-contextual-api-client';

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
  const client = useContextualApiClient();

  return useQuery({
    queryKey: [
      getHairConsultationAnswerDetailQueryKeyPrefix(hairConsultationId, hairConsultationsAnswerId),
    ],
    queryFn: () =>
      client.get<HairConsultationAnswerDetailResponse>(
        getHairConsultationAnswerDetailEndpoint(hairConsultationId, hairConsultationsAnswerId),
      ),
    enabled: !!hairConsultationId && !!hairConsultationsAnswerId,
  });
}
