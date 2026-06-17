'use client';

import Image from 'next/image';

import type { SalonPickProduct } from '@/entities/salon-pick-product/model/salon-pick-product';
import { trackSalonPickProductClick } from '@/features/salon-pick/api/track-salon-pick-product-click';
import useGetSalonPickProducts from '@/features/salon-pick/api/use-get-salon-pick-products';
import { openExternalLinkInApp } from '@/shared/lib/app-bridge';

function normalizeUrl(url: string | null | undefined) {
  const trimmedUrl = url?.trim() ?? '';
  if (!trimmedUrl) return '';

  try {
    return new URL(trimmedUrl).toString();
  } catch {
    return `https://${trimmedUrl}`;
  }
}

function getDetailAdProduct(products: SalonPickProduct[]) {
  return products.find((product) => product.isActive !== false && !!product.bannerImageUrl?.trim());
}

export default function SalonPickDetailAdSlot() {
  const { data: response } = useGetSalonPickProducts('MAIN');
  const product = getDetailAdProduct(response?.dataList ?? []);
  const bannerImageUrl = normalizeUrl(product?.bannerImageUrl);
  const productLinkUrl = normalizeUrl(product?.productLinkUrl);

  if (!product || !bannerImageUrl) {
    return null;
  }

  const handleClick = () => {
    void trackSalonPickProductClick(product.id).catch(() => undefined);

    if (!productLinkUrl) {
      return;
    }

    if (!openExternalLinkInApp(productLinkUrl)) {
      window.open(productLinkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div className="w-full h-1.5 bg-alternative" />
      <div className="px-5 py-3">
        <button
          type="button"
          className="block w-full overflow-hidden rounded-[4px] bg-alternative text-left"
          aria-label={`${product.productName || '살롱픽'} 광고 보기`}
          onClick={handleClick}
        >
          <span className="relative block aspect-[335/104] w-full">
            <Image
              src={bannerImageUrl}
              alt={product.productName || '살롱픽 광고'}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </span>
        </button>
      </div>
    </>
  );
}
