import { useCallback, useEffect } from 'react';

import useShowCreatePostGuideSheet from '@/features/posts/hooks/use-show-create-post-guide-sheet';
import useShowDesignerOnboardingSheet from '@/features/posts/hooks/use-show-designer-onboarding-sheet';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';

import { getUserGuideData, updateUserGuideData, type UserGuideData } from '../lib';
import type { KeyOf } from '../type/types';

export interface UseGuidePopupProps {
  onClose: () => void;
}

function useShowGuide(
  key: KeyOf<UserGuideData>,
  { shouldShow }: { shouldShow?: boolean } = { shouldShow: true },
) {
  const userGuideData = getUserGuideData();

  const showCreatePostGuideSheet = useShowCreatePostGuideSheet();
  const showDesignerOnboardingSheet = useShowDesignerOnboardingSheet();

  const showGuideMapper = {
    [USER_GUIDE_KEYS.hasSeenCreatePostGuide]: showCreatePostGuideSheet,
    [USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide]: showDesignerOnboardingSheet,
    [USER_GUIDE_KEYS.hasSeenConsultingResponseSidebarGuide]: null,
  };

  const showGuide = showGuideMapper[key];

  const shouldShowGuide = !userGuideData[key] && !!shouldShow;

  const closeGuide = useCallback(() => {
    updateUserGuideData({ [key]: true });
  }, [key]);

  const handleClose = useCallback(() => {
    closeGuide();
  }, [closeGuide]);

  useEffect(() => {
    if (shouldShowGuide && showGuide) {
      showGuide({ onClose: handleClose });
    }
  }, [showGuide, handleClose, shouldShow, shouldShowGuide]);

  return { shouldShowGuide, closeGuide };
}

export default useShowGuide;
