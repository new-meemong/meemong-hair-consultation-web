import type {
  KnownMongConsumePresetType,
  MongConsumePreset,
} from '@/entities/mong/api/mong-consume-preset';

import { apiClient } from '@/shared/api/client';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useQuery } from '@tanstack/react-query';

const GET_MONG_CONSUME_PRESETS_ENDPOINT = 'mong-consume-presets';
export const getMongConsumePresetsQueryKeyPrefix = () => GET_MONG_CONSUME_PRESETS_ENDPOINT;

type GetMongConsumePresetsQueryParams = {
  type?: Extract<KnownMongConsumePresetType, 'CHAT' | 'THUNDER_ANNOUNCEMENTS'>;
  subType?: string;
};

export default function useGetMongConsumePresets(params?: GetMongConsumePresetsQueryParams) {
  const brand = useOptionalBrand();

  return useQuery({
    queryKey: [getMongConsumePresetsQueryKeyPrefix(), params],
    queryFn: () =>
      apiClient.getList<MongConsumePreset>(GET_MONG_CONSUME_PRESETS_ENDPOINT, {
        searchParams: params,
      }),
    enabled: !brand,
  });
}
