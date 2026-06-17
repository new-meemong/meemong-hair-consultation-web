import { useQuery } from '@tanstack/react-query';

import type { SalonPickProduct } from '@/entities/salon-pick-product/model/salon-pick-product';
import { apiClient } from '@/shared/api/client';

export type SalonPickProductSlotType = 'MAIN' | 'DESIGNER_MORE';

const SALON_PICK_PRODUCTS_ENDPOINT = 'salon-pick-products';

export const getSalonPickProductsQueryKeyPrefix = () => SALON_PICK_PRODUCTS_ENDPOINT;

function isUnsupportedSlotTypeError(error: unknown) {
  return error instanceof Error && error.message.includes('SalonPickProducts.slotType');
}

function getSalonPickProducts(slotType: SalonPickProductSlotType, includeSlotType = true) {
  return apiClient.getList<SalonPickProduct>(SALON_PICK_PRODUCTS_ENDPOINT, {
    searchParams: includeSlotType ? { slotType } : undefined,
  });
}

export default function useGetSalonPickProducts(slotType: SalonPickProductSlotType = 'MAIN') {
  return useQuery({
    queryKey: [getSalonPickProductsQueryKeyPrefix(), slotType],
    queryFn: async () => {
      try {
        return await getSalonPickProducts(slotType);
      } catch (error) {
        if (isUnsupportedSlotTypeError(error)) {
          return getSalonPickProducts(slotType, false);
        }

        throw error;
      }
    },
  });
}
