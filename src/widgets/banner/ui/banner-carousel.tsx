'use client';

import React from 'react';

import { type Banner } from '@/entities/posts';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

interface BannerCarouselProps {
  banners: Banner[];
}

export const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  return (
    <div className="px-4">
      <Carousel
        opts={{
          loop: true,
          align: 'center',
          containScroll: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-mx-4">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="px-1 basis-[85%]">
              <div className={`${banner.bgColor} text-white p-6 rounded-lg w-full`}>
                <p className="text-sm mb-1">{banner.subtitle}</p>
                <h2 className="text-3xl font-bold">{banner.title}</h2>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
