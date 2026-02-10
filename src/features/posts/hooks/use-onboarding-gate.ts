'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import type { UserGuideData } from '@/shared/lib/auth';
import type { KeyOf } from '@/shared/type/types';

type UseOnboardingGateProps = {
  guideKey: KeyOf<UserGuideData>;
  enabled: boolean;
};

export default function useOnboardingGate({ guideKey, enabled }: UseOnboardingGateProps) {
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 임시 요구사항: 최초 1회 조건 없이 진입할 때마다 온보딩 노출
    if (!enabled) {
      setIsOnboardingVisible(false);
      return;
    }

    setIsOnboardingVisible(true);
  }, [enabled, pathname]);

  const completeOnboarding = useCallback(() => {
    setIsOnboardingVisible(false);
  }, [guideKey]);

  return {
    isOnboardingVisible,
    completeOnboarding,
  };
}
