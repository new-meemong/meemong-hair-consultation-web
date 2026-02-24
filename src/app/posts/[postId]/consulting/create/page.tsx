'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import useConsultingResponseForm from '@/features/posts/hooks/use-consulting-response-form';
import useConsultingResponseNavigation from '@/features/posts/hooks/use-consulting-response-navigation';
import useOnboardingGate from '@/features/posts/hooks/use-onboarding-gate';
import type { ConsultingResponseFormValues } from '@/features/posts/types/consulting-response-form-values';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import HairConsultationOnboarding from '@/features/posts/ui/hair-consultation-onboarding';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import ConsultingResponseFormContainerNew from '@/widgets/post/ui/consulting-response/consulting-response-form-container-new';

export default function CreateConsultingPostNewPage() {
  const { postId } = useParams();
  const { isUserDesigner } = useAuthContext();

  const { isOnboardingVisible, completeOnboarding } = useOnboardingGate({
    guideKey: USER_GUIDE_KEYS.hasSeenHairConsultationOnboardingDesigner,
    enabled: isUserDesigner,
  });

  const { method } = useConsultingResponseForm({ postId: postId?.toString() ?? '' });

  const [currentStep, setCurrentStep] = useState(1);

  const handlePageReload = (savedContent: WritingStep<ConsultingResponseFormValues>[]) => {
    const savedItem = savedContent.find((item) => item?.content.postId === postId);

    if (!savedItem) return;

    setCurrentStep(savedItem.step);
    method.reset(savedItem.content);
  };

  const { isDirty } = method.formState;

  const { leaveForm } = useConsultingResponseNavigation({
    postId: postId?.toString() ?? '',
    onSavedContentReload: handlePageReload,
  });

  const handleBackClick = () => {
    const writingContent: WritingStep<ConsultingResponseFormValues> = {
      step: currentStep,
      content: method.getValues(),
    };

    const askingSave = isDirty && currentStep > 1;

    leaveForm(writingContent, { askingSave });
  };

  if (!postId) return null;

  if (isOnboardingVisible) {
    return <HairConsultationOnboarding role="designer" onComplete={completeOnboarding} />;
  }

  return (
    <ConsultingResponseFormContainerNew
      method={method}
      onBackClick={handleBackClick}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  );
}
