import Image from 'next/image';

import { XIcon } from 'lucide-react';

import { useOverlayContext } from '../context/overlay-context';

type ImageViewerModalContentProps = {
  id: string;
  imageUrl: string;
  title: string;
};

function ImageViewerModalContent({ id, imageUrl, title }: ImageViewerModalContentProps) {
  const { closeModal } = useOverlayContext();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {/* 헤더 */}
      <div className="flex items-center justify-between w-full px-5 py-5">
        <div className="w-7 h-7" />
        <span className="text-center text-white typo-title-3-semibold">{title}</span>
        <button onClick={() => closeModal(id)}>
          <XIcon className="w-7 h-7 text-label-info" />
        </button>
      </div>

      {/* 이미지 */}
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={`이미지`}
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
