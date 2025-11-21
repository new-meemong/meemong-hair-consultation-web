import { useQuery } from '@tanstack/react-query';

import type { MongConsumePreset } from '@/entities/mong/api/mong-consume-preset';
import { apiClient } from '@/shared/api/client';

const GET_MONG_CONSUME_PRESETS_ENDPOINT = 'mong-consume-presets';
export const getMongConsumePresetsQueryKeyPrefix = () => GET_MONG_CONSUME_PRESETS_ENDPOINT;

export default function useGetMongConsumePresets() {
  return useQuery({
    queryKey: [getMongConsumePresetsQueryKeyPrefix()],
    queryFn: () => apiClient.getList<MongConsumePreset>(GET_MONG_CONSUME_PRESETS_ENDPOINT),
  });
}
