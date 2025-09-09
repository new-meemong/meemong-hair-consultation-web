import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { cn } from '@/shared';

type ConsultingResponseButtonProps = {
  isCommentWriter: boolean;
  onClick: () => void;
};

export default function ConsultingResponseButton({
  isCommentWriter,
  onClick,
}: ConsultingResponseButtonProps) {
  const getButtonText = () => {
    if (isCommentWriter) return '내가 쓴 답글 보러가기';
    return '컨설팅 결과 보러가기';
  };

  return (
    <button
      type="button"
      className={cn(
        'w-full mt-1 py-3 px-4 flex items-center justify-between rounded-6 border-1 border-border-default typo-body-1-medium',
      )}
      onClick={onClick}
    >
      {getButtonText()}
      <ChevronRightIcon className="size-5 fill-label-info" />
    </button>
  );
}
