import type { MyBrand } from '../model/my-brand';
import { createWebApiClient } from '@/shared/lib/web-api';

type MyDesignerPageResponse = {
  brand?: MyBrand | null;
};

export async function getMyBrand(token: string): Promise<MyBrand | null> {
  const api = createWebApiClient(token);
  const brand = await api.get<MyBrand | null>('brands/me');
  if (brand) {
    return brand;
  }

  try {
    const designer = await api.get<MyDesignerPageResponse>('designers/me/my-page');
    return designer.brand ?? null;
  } catch (error) {
    console.error('디자이너 브랜드 fallback 조회 실패:', error);
    return brand;
  }
}
