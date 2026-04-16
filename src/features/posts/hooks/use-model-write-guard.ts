'use client';

import { getModelBreakStatus, releaseModelBreakStatus } from '@/features/posts/api/model-break';
import { useCallback, useState } from 'react';

type UseModelWriteGuardParams = {
  token?: string;
  slug?: string;
  isUserModel: boolean;
  onProceedWrite: () => void;
};

export function useModelWriteGuard({
  token,
  slug,
  isUserModel,
  onProceedWrite,
}: UseModelWriteGuardParams) {
  const [isBreakSheetOpen, setIsBreakSheetOpen] = useState(false);
  const [isBreakReleaseSubmitting, setIsBreakReleaseSubmitting] = useState(false);

  const closeBreakSheet = useCallback(() => {
    setIsBreakSheetOpen(false);
  }, []);

  const handleBreakReleaseAndWrite = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setIsBreakReleaseSubmitting(true);
      await releaseModelBreakStatus(token, slug);
      setIsBreakSheetOpen(false);
      onProceedWrite();
    } catch (error) {
      console.error('휴식모드 해제 실패', error);
      window.alert('휴식모드 해제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsBreakReleaseSubmitting(false);
    }
  }, [onProceedWrite, slug, token]);

  const handleWriteButtonClick = useCallback(async () => {
    if (!isUserModel || !token) {
      onProceedWrite();
      return;
    }

    try {
      const isOnBreak = await getModelBreakStatus(token, slug);
      if (isOnBreak) {
        setIsBreakSheetOpen(true);
        return;
      }

      onProceedWrite();
    } catch (error) {
      console.error('휴식 상태 확인 실패', error);
      window.alert('계정 상태를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [isUserModel, onProceedWrite, slug, token]);

  return {
    isBreakSheetOpen,
    isBreakReleaseSubmitting,
    closeBreakSheet,
    handleBreakReleaseAndWrite,
    handleWriteButtonClick,
  };
}
