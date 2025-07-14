import useShowCreatePostGuideSheet from '@/features/posts/hooks/use-show-create-post-guide-sheet';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useCallback, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import type { UserGuideState } from '../lib';
import type { KeyOf } from '../type/types';

export interface UseGuidePopupProps {
  onClose: () => void;
}

function useGuidePopup(key: KeyOf<UserGuideState>) {
  const { user, updateUser } = useAuthContext();

  const showCreatePostGuideSheet = useShowCreatePostGuideSheet();

  const showGuideMapper = {
    [USER_GUIDE_KEYS.hasSeenCreatePostGuide]: showCreatePostGuideSheet,
  };

  const showGuide = showGuideMapper[key];

  const handleClose = useCallback(() => {
    console.log('key', key);
    updateUser({ [key]: true });
  }, [key, updateUser]);

  useEffect(() => {
    if (!user[key]) {
      showGuide({ onClose: handleClose });
    }
  }, [user, key, showGuide, handleClose]);
}

export default useGuidePopup;
