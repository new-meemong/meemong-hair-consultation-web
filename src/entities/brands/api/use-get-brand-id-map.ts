import { brandRegistry } from '@/shared/config/brands';
import { hasBrandCode } from '@/shared/config/brands/brand-code';
import { useContextualApiClient } from '@/shared/api/hooks/use-contextual-api-client';
import { useQueries } from '@tanstack/react-query';

type BrandByCodeResponse = { id: number; code: string; name: string };

const brandedEntries = Object.values(brandRegistry).filter(
  (b): b is typeof b & { brandCode: string } => hasBrandCode(b.brandCode),
);

export function useGetBrandIdMap(): Map<number, string> {
  const client = useContextualApiClient();

  return useQueries({
    queries: brandedEntries.map((brand) => ({
      queryKey: ['brands', 'code', brand.brandCode],
      queryFn: async () => {
        const searchParams = new URLSearchParams({ code: brand.brandCode });
        const res = await client.get<BrandByCodeResponse>('brands/code', { searchParams });
        return { id: res.data.id, name: brand.name };
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      const map = new Map<number, string>();
      results.forEach((result) => {
        if (result.data) {
          map.set(result.data.id, result.data.name);
        }
      });
      return map;
    },
  });
}
