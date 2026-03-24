import { apiClient } from '@/shared/api/client';
import { brandRegistry } from '@/shared/config/brands';
import { useQueries } from '@tanstack/react-query';

type BrandByCodeResponse = { id: number; code: string; name: string };

const brandedEntries = Object.values(brandRegistry).filter(
  (b): b is typeof b & { brandCode: string } => b.brandCode !== null,
);

export function useGetBrandIdMap(): Map<number, string> {
  const results = useQueries({
    queries: brandedEntries.map((brand) => ({
      queryKey: ['brands', 'code', brand.brandCode],
      queryFn: async () => {
        const res = await apiClient.get<BrandByCodeResponse>('brands/code', {
          searchParams: { code: brand.brandCode },
        });
        return { id: res.data.id, name: brand.name };
      },
      staleTime: Infinity,
    })),
  });

  const map = new Map<number, string>();
  results.forEach((result) => {
    if (result.data) {
      map.set(result.data.id, result.data.name);
    }
  });
  return map;
}
