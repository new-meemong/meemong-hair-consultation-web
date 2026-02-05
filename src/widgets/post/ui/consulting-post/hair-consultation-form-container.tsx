import { useEffect, useState } from 'react';

import { FormProvider } from 'react-hook-form';
import HairConsultationForm from '@/features/posts/ui/hair-consultation-form/hair-consultation-form';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import { ROUTES } from '@/shared';
import { SiteHeader } from '@/widgets/header';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import useHairConsultationForm from '@/features/posts/hooks/use-hair-consultation-form';
import usePostFormNavigation from '@/features/posts/hooks/use-consulting-post-form-navigation';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';

export default function HairConsultationFormContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const searchParams = useSearchParams();
  const { replace } = useRouterWithUser();
  const skipReload = searchParams.get('skipReload') === '1';

  const { method, submit, isPending } = useHairConsultationForm();

  const { isDirty } = method.formState;

  const handlePageReload = (savedContent: WritingStep<HairConsultationFormValues>) => {
    if (!savedContent) return;

    setCurrentStep(savedContent.step);
    method.reset(savedContent.content);
  };

  const { leaveForm } = usePostFormNavigation({
    onSavedContentReload: handlePageReload,
    type: USER_WRITING_CONTENT_KEYS.hairConsultation,
    skipReload,
  });

  const handleBackClick = () => {
    const writingContent: WritingStep<HairConsultationFormValues> = {
      step: currentStep,
      content: method.getValues(),
    };

    leaveForm(writingContent, isDirty);
  };

  useEffect(() => {
    if (!skipReload) return;
    replace(ROUTES.POSTS_NEW_CREATE);
  }, [replace, skipReload]);

  return (
    <FormProvider {...method}>
      <SiteHeader title="상담지 작성" showBackButton onBackClick={handleBackClick} />
      <HairConsultationForm
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onSubmit={submit}
        isSubmitting={isPending}
      />
    </FormProvider>
  );
}
