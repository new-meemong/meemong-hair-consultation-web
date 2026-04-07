import type { MyBrand } from '../model/my-brand';
import { createWebApiClient } from '@/shared/lib/web-api';

export async function getMyBrand(token: string): Promise<MyBrand | null> {
  const api = createWebApiClient(token);
  return api.get<MyBrand | null>('brands/me');
}
