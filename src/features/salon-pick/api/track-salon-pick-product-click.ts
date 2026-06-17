import { apiClient } from '@/shared/api/client';

export function trackSalonPickProductClick(salonPickProductId: number) {
  return apiClient.post('salon-pick-products/click', {
    salonPickProductId,
  });
}
