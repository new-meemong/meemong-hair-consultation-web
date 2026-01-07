import { useQuery } from '@tanstack/react-query';

import type { GetMongCurrentResponse } from '@/entities/mong/api/get-mong-current-response';
import { apiClient } from '@/shared/api/client';

const GET_MONG_CURRENT_ENDPOINT = 'mong-moneys/current';
export const getMongCurrentQueryKeyPrefix = () => GET_MONG_CURRENT_ENDPOINT;

type GetMongCurrentParams = {
  mongType?: 'default' | 'event';
};

export default function useGetMongCurrent(params?: GetMongCurrentParams) {
  const { mongType } = params ?? {};

  return useQuery({
    queryKey: [getMongCurrentQueryKeyPrefix(), params],
    queryFn: () =>
      apiClient.get<GetMongCurrentResponse>(GET_MONG_CURRENT_ENDPOINT, {
        searchParams: mongType ? { mongType } : undefined,
      }),
  });
}

