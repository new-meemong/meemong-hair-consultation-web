import { useQuery } from '@tanstack/react-query';

import type { Reward } from '@/entities/mong/api/reward';
import { apiClient } from '@/shared/api/client';

const GET_REWARDS_ENDPOINT = 'rewards';
export const getRewardsQueryKeyPrefix = () => GET_REWARDS_ENDPOINT;

type GetRewardsQueryParams = {
  code?: string;
  isActive?: boolean;
};

export default function useGetRewards(params?: GetRewardsQueryParams) {
  return useQuery({
    queryKey: [getRewardsQueryKeyPrefix(), params],
    queryFn: () =>
      apiClient.getList<Reward>(GET_REWARDS_ENDPOINT, {
        searchParams: params,
      }),
  });
}

