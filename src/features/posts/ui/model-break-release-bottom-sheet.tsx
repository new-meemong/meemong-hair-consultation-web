'use client';

import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Button } from '@/shared/ui/button';
import { Loader } from '@/shared/ui/loader';

type ModelBreakReleaseBottomSheetProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ModelBreakReleaseBottomSheet({
  open,
  isSubmitting,
  onClose,
  onConfirm,
}: ModelBreakReleaseBottomSheetProps) {
  return (
    <BottomSheet
      id="model-break-release-sheet"
      open={open}
      onClose={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
      className="gap-0"
    >
      <div className="flex flex-col gap-2">
        <h2 className="typo-title-2-semibold text-label-default">
          휴식중인 계정입니다. 해제할까요?
        </h2>
        <p className="typo-body-1-long-regular text-label-sub">
          빠른매칭 및 헤어컨설팅 글은 활동중인 계정만 작성할 수 있습니다.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Button
          size="lg"
          theme="white"
          className="flex-1 rounded-4"
          onClick={onClose}
          disabled={isSubmitting}
        >
          닫기
        </Button>
        <Button
          size="lg"
          theme="black"
          className="flex-1 rounded-4"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader size="sm" theme="light" /> : '해제하고 글쓰기'}
        </Button>
      </div>
    </BottomSheet>
  );
}
