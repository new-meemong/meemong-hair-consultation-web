import type { GrowthPassStatus } from '@/entities/growth-pass/api/growth-pass-status';
import { STORE_RETURN_STATUS_KEYS } from '@/shared/lib/store-return-status';
import { apiClient } from '@/shared/api/client';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useQuery } from '@tanstack/react-query';
import useRefetchOnStoreReturn from '@/shared/hooks/use-refetch-on-store-return';

const GET_GROWTH_PASS_STATUS_ENDPOINT = 'growth-passes/status';
export const getGrowthPassStatusQueryKeyPrefix = () => GET_GROWTH_PASS_STATUS_ENDPOINT;

export default function useGetGrowthPassStatus() {
  const brand = useOptionalBrand();

  const query = useQuery({
    queryKey: [getGrowthPassStatusQueryKeyPrefix()],
    queryFn: () => apiClient.get<GrowthPassStatus>(GET_GROWTH_PASS_STATUS_ENDPOINT),
    enabled: !brand,
  });

  useRefetchOnStoreReturn({
    pendingKey: STORE_RETURN_STATUS_KEYS.GROWTH_PASS,
    refetch: async () => {
      await query.refetch();
    },
  });

  return query;
}
