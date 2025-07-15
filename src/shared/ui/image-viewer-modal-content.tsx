import Image from 'next/image';
import { XIcon } from 'lucide-react';
import { useOverlayContext } from '../context/overlay-context';

type ImageViewerModalContentProps = {
  id: string;
  images: string[];
  initialIndex: number;
};

function ImageViewerModalContent({ id, images, initialIndex }: ImageViewerModalContentProps) {
  const { closeModal } = useOverlayContext();

  if (!images.length) return null;

  const totalImages = images.length;
  const currentImage = images[initialIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {/* 헤더 */}
      <div className="flex items-center justify-between w-full px-5 py-5">
        <div className="w-7 h-7" />
        <span className="text-center text-white typo-title-3-semibold">
          {initialIndex + 1}/{totalImages}
        </span>
        <button onClick={() => closeModal(id)}>
          <XIcon className="w-7 h-7 text-label-info" />
        </button>
      </div>

      {/* 이미지 */}
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={currentImage}
            alt={`이미지 ${initialIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default ImageViewerModalContent;
