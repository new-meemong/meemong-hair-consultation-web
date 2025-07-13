import { type ComponentType, useCallback } from 'react';
import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import type { KeyOf } from '../type/types';
import WritePostGuide from '@/features/posts/ui/write-post-guide';

export const USER_GUIDE_KEYS = {
  hasSeenWritePostGuide: 'hasSeenWritePostGuide',
} as const;

export interface UserGuideState {
  [USER_GUIDE_KEYS.hasSeenWritePostGuide]: boolean;
}

export interface GuideComponentProps {
  onClose: () => void;
}

const USER_GUIDE_COMPONENT: Record<KeyOf<UserGuideState>, ComponentType<GuideComponentProps>> = {
  [USER_GUIDE_KEYS.hasSeenWritePostGuide]: WritePostGuide,
};

function useGuidePopup(key: KeyOf<UserGuideState>) {
  const { user, updateUser } = useAuthContext();

  const handleClose = useCallback(() => {
    updateUser({ [key]: true });
  }, [key, updateUser]);

  const GuideComponent = USER_GUIDE_COMPONENT[key];
  const guideElement = !user[key]
    ? React.createElement(GuideComponent, { onClose: handleClose })
    : null;

  return {
    guideElement,
  };
}

export default useGuidePopup;
