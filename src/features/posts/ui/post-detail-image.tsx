import { useAuthContext } from '@/shared/context/auth-context';
import Image from 'next/image';
import BigLockIcon from '@/assets/icons/big-lock.svg';

function HiddenImage() {
  return (
    <div className="w-full h-full bg-label-info flex flex-col gap-1 items-center justify-center">
      <BigLockIcon className="m-1 fill-white" />
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
  onClick: () => void;
  onlyShowToDesigner: boolean;
};

export default function PostDetailImage({
  image,
  onClick,
  onlyShowToDesigner,
}: PostDetailImageProps) {
  const { isUserDesigner } = useAuthContext();

  const shouldShowImage = isUserDesigner || !onlyShowToDesigner;

  return (
    <div
      className="relative min-w-35 h-35 rounded-6 cursor-pointer overflow-hidden"
      onClick={shouldShowImage ? onClick : undefined}
    >
      {shouldShowImage ? (
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
