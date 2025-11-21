import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import GalleryIcon from '@/assets/icons/gallery.svg';
import LockIcon from '@/assets/icons/lock2.svg';

import { useAuthContext } from '@/features/auth/context/auth-context';

import { cn } from '@/shared';

type ConsultingResponseButtonProps = {
  isCommentWriter: boolean;
  hasAnswerImages: boolean;
  onClick: () => void;
};

export default function ConsultingResponseButton({
  isCommentWriter,
  hasAnswerImages,
  onClick,
}: ConsultingResponseButtonProps) {
  const { isUserModel } = useAuthContext();

  const getButtonText = () => {
    if (isCommentWriter) return '내가 쓴 답글 보러가기';
    if (isUserModel) return '컨설팅 결과 보러가기';
    return '컨설팅답변은 모든 고객에게 공개됩니다';
  };

  const hidden = !isUserModel && !isCommentWriter;

  return (
    <button
      type="button"
      className={cn(
        'w-full mt-1 py-3 px-4 flex items-center justify-between rounded-6 border-1 typo-body-1-medium',
        hidden
          ? 'text-label-placeholder border-border-alternative'
          : 'text-label-default border-border-default',
      )}
      onClick={onClick}
      disabled={hidden}
    >
      <div className="flex items-center gap-2">
        {hasAnswerImages && <GalleryIcon className="size-5 fill-negative-light" />}
        {getButtonText()}
      </div>
      {hidden ? (
        <LockIcon className="size-5 fill-label-disable" />
      ) : (
        <ChevronRightIcon className="size-5 fill-label-info" />
      )}
    </button>
  );
}
