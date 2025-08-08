import { useState, useEffect } from 'react';
import { type CarouselApi } from '@/shared/ui/carousel';

type UseCarouselIndexProps = {
  initialIndex?: number;
};

export const useCarouselIndex = ({ initialIndex = 0 }: UseCarouselIndexProps = {}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return {
    currentIndex,
    setApi,
  };
};
