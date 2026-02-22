import { useQuery } from '@tanstack/react-query';

import type { GetTopAdvisorsResponse } from '@/entities/user/model/get-top-advisors-response';
import { HAIR_CONSULTATION_API_PREFIX } from '@/features/posts/constants/api';
import { apiClient } from '@/shared/api/client';

const GET_TOP_ADVISORS_ENDPOINT = `${HAIR_CONSULTATION_API_PREFIX}/top-advisors`;
export const getTopAdvisorsQueryKeyPrefix = () => GET_TOP_ADVISORS_ENDPOINT;

export default function useGetTopAdvisors() {
  return useQuery({
    queryKey: [getTopAdvisorsQueryKeyPrefix()],
    queryFn: () => apiClient.getList<GetTopAdvisorsResponse>(GET_TOP_ADVISORS_ENDPOINT),
  });
}
