import { useEffect, useRef } from 'react';

import type { MongConsumePresetPaymentResult } from '@/entities/mong/api/mong-consume-preset';
import { useOverlayContext } from '@/shared/context/overlay-context';

type UseShowAnswerViewMongConsumeSnackBarParams = {
  dataUpdatedAt: number;
  mongConsumePreset: MongConsumePresetPaymentResult | null | undefined;
};

export default function useShowAnswerViewMongConsumeSnackBar({
  dataUpdatedAt,
  mongConsumePreset,
}: UseShowAnswerViewMongConsumeSnackBarParams) {
  const { showSnackBar } = useOverlayContext();
  const handledDataUpdatedAtRef = useRef(dataUpdatedAt);
  const isPaidThisTime = mongConsumePreset?.isPaidThisTime === true;
  const price = mongConsumePreset?.price ?? 0;

  useEffect(() => {
    if (dataUpdatedAt === 0 || handledDataUpdatedAtRef.current === dataUpdatedAt) {
      return;
    }
    handledDataUpdatedAtRef.current = dataUpdatedAt;

    if (!isPaidThisTime || price <= 0) {
      return;
    }

    showSnackBar({
      type: 'success',
      message: `${price}몽을 사용해 컨설팅 답변을 확인했어요`,
    });
  }, [dataUpdatedAt, isPaidThisTime, price, showSnackBar]);
}
