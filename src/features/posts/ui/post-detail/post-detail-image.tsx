import { useAuthContext } from '@/features/auth/context/auth-context';
import Image from 'next/image';
import LockIcon from '@/assets/icons/lock.svg';
import { isValidUrl } from '@/shared/lib/is-valid-url';
import useShowImageViewerModal from '@/shared/ui/hooks/use-show-image-viewer-modal';
import { cn } from '@/lib/utils';

function HiddenImage() {
  return (
    <div className="w-full h-full bg-label-info flex flex-col gap-1 items-center justify-center">
      <LockIcon className="m-1 size-7 fill-white" />
      <span className="typo-caption-1-regular text-label-placeholder text-center">
        디자이너에게만
        <br />
        공개됩니다
      </span>
    </div>
  );
}

type PostDetailImageProps = {
  images: string[];
  currentIndex: number;
  onlyShowToDesigner: boolean;
  size: 'small' | 'large';
};

const SIZE = {
  small: {
    sizes: '100px',
    width: 'min-w-25',
    height: 'h-25',
  },
  large: {
    sizes: '140px',
    width: 'min-w-35',
    height: 'h-35',
  },
} as const;

export default function PostDetailImage({
  images,
  currentIndex,
  onlyShowToDesigner,
  size,
}: PostDetailImageProps) {
  const { isUserDesigner } = useAuthContext();

  const shouldShowImage = isUserDesigner || !onlyShowToDesigner;

  const currentImage = images[currentIndex];
  const isValidImageUrl = isValidUrl(currentImage);

  const showImageViewerModal = useShowImageViewerModal();

  const handleImageClick = () => {
    showImageViewerModal({
      images,
      initialIndex: currentIndex,
    });
  };

  return (
    <div
      className={cn(
        'relative rounded-6 cursor-pointer overflow-hidden',
        SIZE[size].width,
        SIZE[size].height,
      )}
      onClick={shouldShowImage ? handleImageClick : undefined}
    >
      {shouldShowImage && isValidImageUrl ? (
        <Image
          src={currentImage}
          alt={`게시글 이미지`}
          fill
          className="object-cover"
          sizes={SIZE[size].sizes}
          priority
        />
      ) : (
        <HiddenImage />
      )}
    </div>
  );
}
