import { createWebApiClient } from '@/shared/lib/web-api';
import { useQuery } from '@tanstack/react-query';

type BrandByCodeResponse = {
  id: number;
  code: string;
  name: string;
} | null;

export function useGetBrandByCode(code: string | null, token: string | null, slug?: string) {
  return useQuery({
    queryKey: ['brands', 'code', code],
    queryFn: async () => {
      if (!code || !token) return null;
      const api = createWebApiClient(token, slug);
      return api.get<BrandByCodeResponse>('brands/code', { searchParams: { code } });
    },
    enabled: code !== null && token !== null,
    staleTime: Infinity, // 브랜드 코드는 변경되지 않으므로 영구 캐시
  });
}
