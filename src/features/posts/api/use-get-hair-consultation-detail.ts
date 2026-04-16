import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { HairConsultationDetail } from '@/entities/posts/model/hair-consultation-detail';
import { useContextualApiClient } from '@/shared/api/hooks/use-contextual-api-client';
import { useQuery } from '@tanstack/react-query';

const getHairConsultationDetailEndpoint = (id: string) => `${HAIR_CONSULTATION_API_PREFIX}/${id}`;
export const getHairConsultationDetailQueryKeyPrefix = (id: string) =>
  getHairConsultationDetailEndpoint(id);

export default function useGetHairConsultationDetail(id: string) {
  const client = useContextualApiClient();

  return useQuery({
    queryKey: [getHairConsultationDetailQueryKeyPrefix(id)],
    queryFn: () => client.get<HairConsultationDetail>(getHairConsultationDetailEndpoint(id)),
    enabled: !!id && id !== '0',
  });
}
