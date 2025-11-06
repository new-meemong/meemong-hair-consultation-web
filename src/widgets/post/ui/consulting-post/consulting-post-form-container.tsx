import { useState } from 'react';

import { FormProvider } from 'react-hook-form';

import useConsultingPostForm from '@/features/posts/hooks/use-consulting-post-form';
import usePostFormNavigation from '@/features/posts/hooks/use-consulting-post-form-navigation';
import type { ConsultingPostFormValues } from '@/features/posts/types/consulting-post-form-values';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import ConsultingPostForm from '@/features/posts/ui/consulting-form/consulting-post-form/consulting-post-form';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { SiteHeader } from '@/widgets/header';

export default function ConsultingPostFormContainer() {
  const [currentStep, setCurrentStep] = useState(1);

  const { method, submit: submitConsultingForm } = useConsultingPostForm();

  const { isDirty } = method.formState;

  const handlePageReload = (savedContent: WritingStep<ConsultingPostFormValues>) => {
    if (!savedContent) return;

    setCurrentStep(savedContent.step);
    method.reset(savedContent.content);
  };

  const { leaveForm } = usePostFormNavigation({
    onSavedContentReload: handlePageReload,
    type: USER_WRITING_CONTENT_KEYS.consultingPost,
  });

  const handleBackClick = () => {
    const writingContent: WritingStep<ConsultingPostFormValues> = {
      step: currentStep,
      content: method.getValues(),
    };

    leaveForm(writingContent, isDirty);
  };

  return (
    <FormProvider {...method}>
      <SiteHeader title="상담지 작성" showBackButton onBackClick={handleBackClick} />
      <ConsultingPostForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onSubmit={submitConsultingForm}
      />
    </FormProvider>
  );
}
