import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import LockIcon from '@/assets/icons/lock2.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { cn } from '@/shared';

type ConsultingResponseButtonProps = {
  isCommentWriter: boolean;
  onClick: () => void;
};

export default function ConsultingResponseButton({
  isCommentWriter,
  onClick,
}: ConsultingResponseButtonProps) {
  const { isUserModel } = useAuthContext();

  const getButtonText = () => {
    if (isCommentWriter) return '내가 쓴 답글 보러가기';
    if (isUserModel) return '컨설팅 결과 보러가기';
    return '글 작성자만 볼 수 있는 답변입니다';
  };

  const hidden = !isUserModel && !isCommentWriter;

  return (
    <button
      type="button"
      className={cn(
        'w-full mt-1 py-3 px-4 flex items-center justify-between rounded-6 border-1  typo-body-1-medium',
        hidden
          ? 'text-label-disable border-border-alternative'
          : 'text-label-default border-border-default',
      )}
      onClick={onClick}
      disabled={hidden}
    >
      {getButtonText()}
      {hidden ? (
        <LockIcon className="size-5 fill-label-disable" />
      ) : (
        <ChevronRightIcon className="size-5 fill-label-info" />
      )}
    </button>
  );
}
