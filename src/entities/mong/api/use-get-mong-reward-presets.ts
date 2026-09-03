import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/client';

import type { MongRewardPreset } from './mong-reward-preset';

const GET_MONG_REWARD_PRESETS_ENDPOINT = 'mong-reward-presets';

export const getMongRewardPresetsQueryKeyPrefix = () => GET_MONG_REWARD_PRESETS_ENDPOINT;

type GetMongRewardPresetsQueryParams = {
  code?: string;
  isActive?: boolean;
};

type UseGetMongRewardPresetsOptions = {
  enabled?: boolean;
};

export default function useGetMongRewardPresets(
  params?: GetMongRewardPresetsQueryParams,
  options?: UseGetMongRewardPresetsOptions,
) {
  return useQuery({
    queryKey: [getMongRewardPresetsQueryKeyPrefix(), params],
    queryFn: () =>
      apiClient.getList<MongRewardPreset>(GET_MONG_REWARD_PRESETS_ENDPOINT, {
        searchParams: params,
      }),
    enabled: options?.enabled,
    meta: { skipGlobalError: true },
  });
}
