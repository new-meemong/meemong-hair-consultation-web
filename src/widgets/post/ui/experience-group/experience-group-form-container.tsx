import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import useExperienceGroupForm from '@/features/posts/hooks/experience-group/use-experience-group-form';
import usePostFormNavigation from '@/features/posts/hooks/use-consulting-post-form-navigation';
import type { ExperienceGroupFormValues } from '@/features/posts/types/experience-group-form-values';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import ExperienceGroupForm from '@/features/posts/ui/experience-group-form/experience-group-form';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { SiteHeader } from '@/widgets/header';

export default function ExperienceGroupFormContainer() {
  const [currentStep, setCurrentStep] = useState(1);

  const { method, submit } = useExperienceGroupForm();

  const { isDirty } = method.formState;

  const handlePageReload = (savedContent: WritingStep<ExperienceGroupFormValues>) => {
    if (!savedContent) return;

    setCurrentStep(savedContent.step);
    method.reset(savedContent.content);
  };

  const { leaveForm } = usePostFormNavigation({
    onSavedContentReload: handlePageReload,
    type: USER_WRITING_CONTENT_KEYS.experienceGroup,
  });

  const handleBackClick = () => {
    const writingContent: WritingStep<ExperienceGroupFormValues> = {
      step: currentStep,
      content: method.getValues(),
    };

    leaveForm(writingContent, isDirty);
  };

  return (
    <FormProvider {...method}>
      <SiteHeader title="협찬 신청글 작성" showBackButton onBackClick={handleBackClick} />
      <ExperienceGroupForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onSubmit={submit}
      />
    </FormProvider>
  );
}
