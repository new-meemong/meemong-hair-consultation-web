'use client';

import { getModelBreakStatus, releaseModelBreakStatus } from '@/entities/user/api/model-profile';
import { getErrorMessage } from '@/shared/lib/error-handler';
import { showGlobalSnackBar } from '@/shared/lib/global-overlay';
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
      showGlobalSnackBar({
        type: 'error',
        message: getErrorMessage(error),
      });
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
      showGlobalSnackBar({
        type: 'error',
        message: getErrorMessage(error),
      });
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
