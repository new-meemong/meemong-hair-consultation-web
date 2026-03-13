import { useQuery } from '@tanstack/react-query';

import type { AdBlockStatus } from '@/entities/ad-block/api/ad-block-status';
import { apiClient } from '@/shared/api/client';

const GET_AD_BLOCK_STATUS_ENDPOINT = 'ad-blocks/status';
export const getAdBlockStatusQueryKeyPrefix = () => GET_AD_BLOCK_STATUS_ENDPOINT;

export default function useGetAdBlockStatus() {
  return useQuery({
    queryKey: [getAdBlockStatusQueryKeyPrefix()],
    queryFn: () => apiClient.get<AdBlockStatus>(GET_AD_BLOCK_STATUS_ENDPOINT),
  });
}
