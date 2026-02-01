import { HAIR_CONSULTATION_API_PREFIX } from '../constants/api';
import type { HairConsultationTopAdvisor } from '@/entities/posts/model/hair-consultation-top-advisor';
import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

const GET_HAIR_CONSULTATION_TOP_ADVISORS_ENDPOINT = `${HAIR_CONSULTATION_API_PREFIX}/top-advisors`;
export const getHairConsultationTopAdvisorsQueryKeyPrefix = () =>
  GET_HAIR_CONSULTATION_TOP_ADVISORS_ENDPOINT;

type HairConsultationTopAdvisorsResponse = {
  dataCount: number;
  dataList: HairConsultationTopAdvisor[];
};

export default function useGetHairConsultationTopAdvisors() {
  return useQuery({
    queryKey: [getHairConsultationTopAdvisorsQueryKeyPrefix()],
    queryFn: () =>
      apiClient.get<HairConsultationTopAdvisorsResponse>(
        GET_HAIR_CONSULTATION_TOP_ADVISORS_ENDPOINT,
      ),
  });
}
