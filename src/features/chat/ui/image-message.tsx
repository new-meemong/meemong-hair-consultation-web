import Image from 'next/image';
import { getChatImages } from '../lib/get-chat-images';
import { cn } from '@/lib/utils';
import { isValidUrl } from '@/shared/lib/is-valid-url';
import useShowImageViewerModal from '@/shared/ui/hooks/use-show-image-viewer-modal';

const getLayouts = (images: string[]) => {
  const totalImages = images.length;

  if (totalImages === 1) return [{ cols: 1, images: images }];
  if (totalImages % 2 === 0) return [{ cols: 2, images: images }];
  if (totalImages % 3 === 0) return [{ cols: 3, images: images }];

  const isOdd = totalImages % 2 === 1;

  if (isOdd) {
    const twoColCount = totalImages - 3;

    return [
      { cols: 2, images: images.slice(0, twoColCount) },
      { cols: 3, images: images.slice(twoColCount) },
    ];
  }

  return [{ cols: 3, images: images }];
};

type ImageMessageProps = {
  message: string;
};

export default function ImageMessage({ message }: ImageMessageProps) {
  const images = getChatImages(message);

  const layouts = getLayouts(images);

  const showImageViewerModal = useShowImageViewerModal();

  const handleImageClick = (image: string) => {
    showImageViewerModal({
      images,
      initialIndex: images.indexOf(image),
    });
  };

  return (
    <div className="w-59 flex flex-col gap-1">
      {layouts.map((layout, index) => (
        <div key={index} className={cn('grid gap-1', `grid-cols-${layout.cols}`)}>
          {layout.images.map((image) => {
            const isImage = isValidUrl(image);

            if (!isImage) return null;

            return (
              <div key={image} className={cn('relative aspect-square')}>
                <Image
                  src={image}
                  alt="image"
                  fill
                  className="object-cover rounded-10"
                  onClick={() => handleImageClick(image)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
