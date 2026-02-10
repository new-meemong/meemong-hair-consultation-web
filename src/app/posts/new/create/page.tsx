'use client';

import { useState } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import useOnboardingGate from '@/features/posts/hooks/use-onboarding-gate';
import HairConsultationOnboarding from '@/features/posts/ui/hair-consultation-onboarding';
import HairConsultationFormContainer from '@/widgets/post/ui/consulting-post/hair-consultation-form-container';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';

export default function CreateHairConsultationPage() {
  const { isUserModel } = useAuthContext();

  const { isOnboardingVisible, completeOnboarding } = useOnboardingGate({
    guideKey: USER_GUIDE_KEYS.hasSeenHairConsultationOnboardingModel,
    enabled: isUserModel,
  });

  const [initialHeight] = useState(() => window.innerHeight);

  if (isOnboardingVisible) {
    return <HairConsultationOnboarding role="model" onComplete={completeOnboarding} />;
  }

  return (
    <div className="h-screen bg-white flex flex-col min-h-0" style={{ minHeight: initialHeight }}>
      <HairConsultationFormContainer />
    </div>
  );
}
