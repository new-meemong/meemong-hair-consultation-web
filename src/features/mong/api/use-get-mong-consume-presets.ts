import type {
  MongConsumePreset,
  MongConsumePresetSubType,
  MongConsumePresetType,
} from '@/entities/mong/api/mong-consume-preset';

import { apiClient } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

const GET_MONG_CONSUME_PRESETS_ENDPOINT = 'mong-consume-presets';
export const getMongConsumePresetsQueryKeyPrefix = () => GET_MONG_CONSUME_PRESETS_ENDPOINT;

type GetMongConsumePresetsQueryParams = {
  type?: MongConsumePresetType;
  subType?: MongConsumePresetSubType;
};

export default function useGetMongConsumePresets(params?: GetMongConsumePresetsQueryParams) {
  return useQuery({
    queryKey: [getMongConsumePresetsQueryKeyPrefix(), params],
    queryFn: () =>
      apiClient.getList<MongConsumePreset>(GET_MONG_CONSUME_PRESETS_ENDPOINT, {
        searchParams: params,
      }),
  });
}
