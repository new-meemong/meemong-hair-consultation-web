import { useAuthContext } from '@/features/auth/context/auth-context';
import Image from 'next/image';
import LockIcon from '@/assets/icons/lock.svg';
import { isValidUrl } from '@/shared/lib/is-valid-url';
import useShowImageViewerModal from '@/shared/ui/hooks/use-show-image-viewer-modal';

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
  image: string;
  totalImages: number;
  currentIndex: number;
  onlyShowToDesigner: boolean;
};

export default function PostDetailImage({
  image,
  totalImages,
  currentIndex,
  onlyShowToDesigner,
}: PostDetailImageProps) {
  const { isUserDesigner } = useAuthContext();

  const shouldShowImage = isUserDesigner || !onlyShowToDesigner;

  const isValidImageUrl = isValidUrl(image);

  const showImageViewerModal = useShowImageViewerModal();

  const handleImageClick = () => {
    showImageViewerModal({
      title: `${currentIndex + 1}/${totalImages}`,
      imageUrl: image,
    });
  };

  return (
    <div
      className="relative min-w-35 h-35 rounded-6 cursor-pointer overflow-hidden"
      onClick={shouldShowImage ? handleImageClick : undefined}
    >
      {shouldShowImage && isValidImageUrl ? (
        <Image
          src={image}
          alt={`게시글 이미지`}
          fill
          className="object-cover"
          sizes="140px"
          priority
        />
      ) : (
        <HiddenImage />
      )}
    </div>
  );
}
