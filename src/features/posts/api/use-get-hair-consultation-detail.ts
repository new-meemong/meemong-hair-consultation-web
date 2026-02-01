import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { HairConsultationDetail } from '@/entities/posts/model/hair-consultation-detail';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

const getHairConsultationDetailEndpoint = (id: string) => `${HAIR_CONSULTATION_API_PREFIX}/${id}`;
export const getHairConsultationDetailQueryKeyPrefix = (id: string) =>
  getHairConsultationDetailEndpoint(id);

export default function useGetHairConsultationDetail(id: string) {
  return useQuery({
    queryKey: [getHairConsultationDetailQueryKeyPrefix(id)],
    queryFn: () => apiClient.get<HairConsultationDetail>(getHairConsultationDetailEndpoint(id)),
    enabled: !!id,
  });
}
