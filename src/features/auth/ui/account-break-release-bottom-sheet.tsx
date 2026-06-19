'use client';

import CloseIcon from '@/assets/icons/close.svg';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Button } from '@/shared/ui/button';
import { Loader } from '@/shared/ui/loader';

type AccountBreakReleaseBottomSheetProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AccountBreakReleaseBottomSheet({
  open,
  isSubmitting,
  onClose,
  onConfirm,
}: AccountBreakReleaseBottomSheetProps) {
  return (
    <BottomSheet
      id="account-break-release-sheet"
      open={open}
      onClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
      className="gap-0 pt-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="typo-title-3-semibold text-label-default">휴식 계정을 해제하시겠어요?</h2>
        <button
          type="button"
          aria-label="닫기"
          className="flex size-7 shrink-0 items-center justify-center disabled:opacity-40"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <CloseIcon className="size-7 fill-label-info" />
        </button>
      </div>

      <p className="mt-6 typo-body-2-long-regular text-label-default">
        앱에서 언제든 다시 휴식 상태로 전환할 수 있어요
      </p>

      <Button
        size="lg"
        theme="black"
        className="mt-6 w-full rounded-4"
        onClick={onConfirm}
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader size="sm" theme="light" /> : '해제하고 컨설팅 시작하기'}
      </Button>
    </BottomSheet>
  );
}
