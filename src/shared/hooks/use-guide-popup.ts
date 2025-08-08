import { useCallback, useEffect } from 'react';

import useShowCreatePostGuideSheet from '@/features/posts/hooks/use-show-create-post-guide-sheet';
import useShowDesignerOnboardingSheet from '@/features/posts/hooks/use-show-designer-onboarding-sheet';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';

import { useAuthContext } from '../../features/auth/context/auth-context';
import type { UserGuideState } from '../lib';
import type { KeyOf } from '../type/types';


export interface UseGuidePopupProps {
  onClose: () => void;
}

function useGuidePopup(
  key: KeyOf<UserGuideState>,
  { shouldShow }: { shouldShow?: boolean } = { shouldShow: true },
) {
  const { user, updateUser } = useAuthContext();

  const showCreatePostGuideSheet = useShowCreatePostGuideSheet();
  const showDesignerOnboardingSheet = useShowDesignerOnboardingSheet();

  const showGuideMapper = {
    [USER_GUIDE_KEYS.hasSeenCreatePostGuide]: showCreatePostGuideSheet,
    [USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide]: showDesignerOnboardingSheet,
  };

  const showGuide = showGuideMapper[key];

  const handleClose = useCallback(() => {
    updateUser({ [key]: true });
  }, [key, updateUser]);

  useEffect(() => {
    if (!user[key] && shouldShow) {
      showGuide({ onClose: handleClose });
    }
  }, [user, key, showGuide, handleClose, shouldShow]);
}

export default useGuidePopup;
