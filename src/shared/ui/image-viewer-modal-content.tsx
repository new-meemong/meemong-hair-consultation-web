import React from 'react';

import Image from 'next/image';

import { XIcon } from 'lucide-react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import DownloadIcon from '@/assets/icons/download.svg';
import { downloadImage } from '@/shared/lib/download-image';

import { useOverlayContext } from '../context/overlay-context';

import { Carousel, CarouselContent, CarouselItem } from './carousel';
import { useCarouselIndex } from './hooks/use-carousel-index';

function ImageViewerModalHeader({
  title,
  leftComponent,
  rightComponent,
}: {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between w-full px-5 py-5">
      {leftComponent ? leftComponent : <div className="size-7" />}
      <span className="text-center text-white typo-title-3-semibold">{title}</span>
      {rightComponent}
    </div>
  );
}

export type ImageViewerModalContentProps = {
  id: string;
  images: string[];
  initialIndex?: number;
  iconType?: 'close' | 'download';
};

function ImageViewerModalContent({
  id,
  images,
  initialIndex = 0,
  iconType = 'close',
}: ImageViewerModalContentProps) {
  const { closeModal } = useOverlayContext();

  const { currentIndex, setApi } = useCarouselIndex({ initialIndex });

  const handleClose = () => {
    closeModal(id);
  };

  const handleDownload = () => {
    const currentImage = images[currentIndex];
    downloadImage({
      url: currentImage,
      fileName: `image-${currentIndex + 1}`,
    });
  };

  const CloseButton = () => (
    <button onClick={handleClose}>
      <XIcon className="w-7 h-7 text-label-info" />
    </button>
  );

  const DownloadButton = () => (
    <button onClick={handleDownload}>
      <DownloadIcon className="size-7 text-label-info" />
    </button>
  );

  const BackButton = () => (
    <button onClick={handleClose}>
      <ChevronLeftIcon className="size-7 fill-label-info" />
    </button>
  );

  const showBackButton = iconType === 'download';

  const renderRightComponent = () => {
    switch (iconType) {
      case 'close':
        return <CloseButton />;
      case 'download':
        return <DownloadButton />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <ImageViewerModalHeader
        title={`${currentIndex + 1}/${images.length}`}
        leftComponent={showBackButton && <BackButton />}
        rightComponent={renderRightComponent()}
      />

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
