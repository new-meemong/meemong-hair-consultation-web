'use client';

import { getUserGuideData, updateUserGuideData } from '@/shared/lib/auth';
import { useCallback, useEffect, useState } from 'react';

import type { KeyOf } from '@/shared/type/types';
import type { UserGuideData } from '@/shared/lib/auth';

type UseOnboardingGateProps = {
  guideKey: KeyOf<UserGuideData>;
  enabled: boolean;
};

export default function useOnboardingGate({ guideKey, enabled }: UseOnboardingGateProps) {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsOnboardingVisible(false);
      return;
    }

    const hasSeenOnboarding = getUserGuideData()[guideKey];
    setIsOnboardingVisible(!hasSeenOnboarding);
  }, [enabled, guideKey]);

  const completeOnboarding = useCallback(() => {
    updateUserGuideData({ [guideKey]: true });
    setIsOnboardingVisible(false);
  }, [guideKey]);

  return {
    isOnboardingVisible,
    completeOnboarding,
  };
}
