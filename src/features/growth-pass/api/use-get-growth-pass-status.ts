import { useQuery } from '@tanstack/react-query';

import type { GrowthPassStatus } from '@/entities/growth-pass/api/growth-pass-status';
import { apiClient } from '@/shared/api/client';

const GET_GROWTH_PASS_STATUS_ENDPOINT = 'growth-passes/status';
export const getGrowthPassStatusQueryKeyPrefix = () => GET_GROWTH_PASS_STATUS_ENDPOINT;

export default function useGetGrowthPassStatus() {
  return useQuery({
    queryKey: [getGrowthPassStatusQueryKeyPrefix()],
    queryFn: () => apiClient.get<GrowthPassStatus>(GET_GROWTH_PASS_STATUS_ENDPOINT),
  });
}

