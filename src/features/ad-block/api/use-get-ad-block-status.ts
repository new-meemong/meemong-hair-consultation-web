import type { AdBlockStatus } from '@/entities/ad-block/api/ad-block-status';
import { STORE_RETURN_STATUS_KEYS } from '@/shared/lib/store-return-status';
import { apiClient } from '@/shared/api/client';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useQuery } from '@tanstack/react-query';
import useRefetchOnStoreReturn from '@/shared/hooks/use-refetch-on-store-return';

const GET_AD_BLOCK_STATUS_ENDPOINT = 'ad-blocks/status';
export const getAdBlockStatusQueryKeyPrefix = () => GET_AD_BLOCK_STATUS_ENDPOINT;

export default function useGetAdBlockStatus() {
  const brand = useOptionalBrand();

  const query = useQuery({
    queryKey: [getAdBlockStatusQueryKeyPrefix()],
    queryFn: () => apiClient.get<AdBlockStatus>(GET_AD_BLOCK_STATUS_ENDPOINT),
    enabled: !brand,
  });

  useRefetchOnStoreReturn({
    pendingKey: STORE_RETURN_STATUS_KEYS.MEEMONG_PASS,
    refetch: async () => {
      if (brand) return;
      await query.refetch();
    },
  });

  return query;
}
