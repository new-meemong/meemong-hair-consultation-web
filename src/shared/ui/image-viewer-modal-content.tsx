import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { useOverlayContext } from '../context/overlay-context';
import React, { useEffect, useState } from 'react';
import { downloadImage } from '@/shared/lib/download-image';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from './carousel';
import DownloadIcon from '@/assets/icons/download.svg';

function ImageViewerModalHeader({
  title,
  rightComponent,
}: {
  title: string;
  rightComponent?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between w-full px-5 py-5">
      <div className="w-7 h-7" />
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
