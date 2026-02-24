'use client';

import { useState } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useOnboardingGate from '@/features/posts/hooks/use-onboarding-gate';
import { usePostTab } from '@/features/posts/hooks/use-post-tab';
import HairConsultationOnboarding from '@/features/posts/ui/hair-consultation-onboarding';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useShowGuide from '@/shared/hooks/use-show-guide';
import type { ValueOf } from '@/shared/type/types';
import HairConsultationFormContainer from '@/widgets/post/ui/consulting-post/hair-consultation-form-container';
import ExperienceGroupFormContainer from '@/widgets/post/ui/experience-group/experience-group-form-container';

export default function CreatePostPage() {
  useShowGuide(USER_GUIDE_KEYS.hasSeenCreatePostGuide);
  const { isUserModel } = useAuthContext();
  const { isOnboardingVisible, completeOnboarding } = useOnboardingGate({
    guideKey: USER_GUIDE_KEYS.hasSeenHairConsultationOnboardingModel,
    enabled: isUserModel,
  });

  const [initialHeight] = useState(() => window.innerHeight);

  const [selectedTab] = usePostTab();

  const renderForm = (type: ValueOf<typeof CONSULT_TYPE>) => {
    switch (type) {
      case CONSULT_TYPE.CONSULTING:
        if (isOnboardingVisible) {
          return <HairConsultationOnboarding role="model" onComplete={completeOnboarding} />;
        }
        return <HairConsultationFormContainer />;
      // case CONSULT_TYPE.GENERAL:
      //   return <PostFormContainer />;
      case CONSULT_TYPE.EXPERIENCE_GROUP:
        return <ExperienceGroupFormContainer />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col min-h-0" style={{ minHeight: initialHeight }}>
      {renderForm(selectedTab)}
    </div>
  );
}
