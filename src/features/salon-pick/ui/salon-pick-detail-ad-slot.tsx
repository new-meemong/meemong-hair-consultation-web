'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import type { SalonPickProduct } from '@/entities/salon-pick-product/model/salon-pick-product';
import { trackSalonPickProductClick } from '@/features/salon-pick/api/track-salon-pick-product-click';
import useGetSalonPickProducts from '@/features/salon-pick/api/use-get-salon-pick-products';
import { openExternalLinkInApp } from '@/shared/lib/app-bridge';
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

const AUTO_SCROLL_INTERVAL_MS = 2000;
const AUTO_SCROLL_RESUME_DELAY_MS = 2000;

function normalizeUrl(url: string | null | undefined) {
  const trimmedUrl = url?.trim() ?? '';
  if (!trimmedUrl) return '';

  try {
    return new URL(trimmedUrl).toString();
  } catch {
    return `https://${trimmedUrl}`;
  }
}

function getDetailAdProducts(products: SalonPickProduct[]) {
  return products
    .filter((product) => product.isActive !== false && !!product.bannerImageUrl?.trim())
    .slice(0, 2);
}

export default function SalonPickDetailAdSlot() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  // These refs are read by the long-lived interval, so pointer events can pause immediately.
  const isAutoScrollPausedRef = useRef(false);
  const isUserInteractingRef = useRef(false);
  const { data: response } = useGetSalonPickProducts('MAIN');
  const products = getDetailAdProducts(response?.dataList ?? []);
  const shouldUseCarousel = products.length > 1;
  // Embla can disable native loop when there are too few slides for the peek layout.
  // Duplicates keep the carousel moving forward without a visible rewind.
  const carouselProducts = shouldUseCarousel ? [...products, ...products] : products;

  useEffect(() => {
    if (!carouselApi || !shouldUseCarousel) return;

    isAutoScrollPausedRef.current = false;

    const intervalId = window.setInterval(() => {
      if (isAutoScrollPausedRef.current) return;

      const nextIndex = carouselApi.selectedScrollSnap() + 1;
      carouselApi.scrollTo(nextIndex);
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [carouselApi, shouldUseCarousel]);

  useEffect(() => {
    if (!carouselApi || !shouldUseCarousel) return;

    const resetDuplicateSlide = (api: CarouselApi) => {
      if (!api) return;

      const selectedIndex = api.selectedScrollSnap();
      if (selectedIndex >= products.length) {
        api.scrollTo(selectedIndex % products.length, true);
      }
    };

    carouselApi.on('settle', resetDuplicateSlide);

    return () => {
      carouselApi.off('settle', resetDuplicateSlide);
    };
  }, [carouselApi, products.length, shouldUseCarousel]);

  useEffect(() => {
    if (!carouselApi || !shouldUseCarousel) return;

    let resumeTimeoutId: number | undefined;

    const clearResumeTimeout = () => {
      if (resumeTimeoutId === undefined) return;
      window.clearTimeout(resumeTimeoutId);
      resumeTimeoutId = undefined;
    };

    const pauseAutoScroll = () => {
      isUserInteractingRef.current = true;
      isAutoScrollPausedRef.current = true;
      clearResumeTimeout();
    };

    const scheduleAutoScrollResume = () => {
      if (!isUserInteractingRef.current) return;

      clearResumeTimeout();
      resumeTimeoutId = window.setTimeout(() => {
        isUserInteractingRef.current = false;
        isAutoScrollPausedRef.current = false;
        resumeTimeoutId = undefined;
      }, AUTO_SCROLL_RESUME_DELAY_MS);
    };

    carouselApi.on('pointerDown', pauseAutoScroll);
    carouselApi.on('pointerUp', scheduleAutoScrollResume);
    carouselApi.on('settle', scheduleAutoScrollResume);

    return () => {
      clearResumeTimeout();
      isUserInteractingRef.current = false;
      isAutoScrollPausedRef.current = false;
      carouselApi.off('pointerDown', pauseAutoScroll);
      carouselApi.off('pointerUp', scheduleAutoScrollResume);
      carouselApi.off('settle', scheduleAutoScrollResume);
    };
  }, [carouselApi, shouldUseCarousel]);

  const handleClick = (product: SalonPickProduct) => {
    const productLinkUrl = normalizeUrl(product.productLinkUrl);
    void trackSalonPickProductClick(product.id).catch(() => undefined);

    if (!productLinkUrl) {
      return;
    }

    if (!openExternalLinkInApp(productLinkUrl)) {
      window.open(productLinkUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full h-1.5 bg-alternative" />
      <div className="py-3">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            loop: false,
            align: 'start',
            containScroll: false,
            watchDrag: shouldUseCarousel,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {carouselProducts.map((product, index) => {
              const bannerImageUrl = normalizeUrl(product.bannerImageUrl);
              const isDuplicateSlide = index >= products.length;

              return (
                <CarouselItem
                  key={`${product.id}-${index}`}
                  className="basis-[calc(100%_-_32px)] pl-0"
                  aria-hidden={isDuplicateSlide || undefined}
                >
                  <button
                    type="button"
                    className="ml-5 block w-[calc(100%_-_8px)] overflow-hidden rounded-[4px] bg-alternative text-left"
                    aria-label={`${product.productName || '살롱픽'} 광고 보기`}
                    tabIndex={isDuplicateSlide ? -1 : undefined}
                    onClick={() => handleClick(product)}
                  >
                    <span className="relative block aspect-[336/80] w-full">
                      <Image
                        src={bannerImageUrl}
                        alt={product.productName || '살롱픽 광고'}
                        fill
                        unoptimized
                        sizes="calc(100vw - 40px)"
                        className="object-cover"
                      />
                    </span>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
}
