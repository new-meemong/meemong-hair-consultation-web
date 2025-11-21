import { useQuery } from '@tanstack/react-query';

import type { ExperienceGroupDetail } from '@/entities/posts/model/experience-group-detail';

import { apiClient } from '@/shared/api/client';

import { EXPERIENCE_GROUP_API_PREFIX } from '../constants/api';

const getGetExperienceGroupDetailEndpoint = (id: string) => `${EXPERIENCE_GROUP_API_PREFIX}/${id}`;
export const getExperienceGroupDetailQueryKeyPrefix = (id: string) =>
  getGetExperienceGroupDetailEndpoint(id);

export default function useGetExperienceGroupDetail(id: string) {
  return useQuery({
    queryKey: [getExperienceGroupDetailQueryKeyPrefix(id)],
    queryFn: () => apiClient.get<ExperienceGroupDetail>(getGetExperienceGroupDetailEndpoint(id)),
    enabled: !!id,
  });
}
