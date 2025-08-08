import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { useOverlayContext } from '../context/overlay-context';
import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from './carousel';

type ImageViewerModalContentProps = {
  id: string;
  images: string[];
  initialIndex?: number;
};

function ImageViewerModalContent({ id, images, initialIndex = 0 }: ImageViewerModalContentProps) {
  const { closeModal } = useOverlayContext();

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

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="flex items-center justify-between w-full px-5 py-5">
        <div className="w-7 h-7" />
        <span className="text-center text-white typo-title-3-semibold">{`${currentIndex + 1}/${images.length}`}</span>
        <button onClick={() => closeModal(id)}>
          <XIcon className="w-7 h-7 text-label-info" />
        </button>
      </div>

      {/* 이미지 */}
      <div className="flex-1 w-full">
        <Carousel
          opts={{
            loop: true,
            align: 'center',
            containScroll: false,
          }}
          className="w-full h-full"
          setApi={setApi}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={`${index}-${image}`} className="basis-full">
                <div className="relative h-[calc(100vh-68px)]">
                  <Image
                    src={image}
                    alt={`이미지`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default ImageViewerModalContent;
