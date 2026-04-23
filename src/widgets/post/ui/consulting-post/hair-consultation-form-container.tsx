import { closeAppWebView, normalizeSource } from '@/shared/lib/app-bridge';
import {
  hasLostHairConsultationImages,
  normalizeHairConsultationContent,
} from '@/features/posts/lib/normalize-hair-consultation-content';
import { useEffect, useRef, useState } from 'react';

import { FormProvider } from 'react-hook-form';
import HairConsultationForm from '@/features/posts/ui/hair-consultation-form/hair-consultation-form';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';
import { ROUTES } from '@/shared';
import { SiteHeader } from '@/widgets/header';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import useHairConsultationForm from '@/features/posts/hooks/use-hair-consultation-form';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useOverlayContext } from '@/shared/context/overlay-context';
import usePostFormNavigation from '@/features/posts/hooks/use-consulting-post-form-navigation';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';

export default function HairConsultationFormContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const hasShownLostImageNoticeRef = useRef(false);
  const searchParams = useSearchParams();
  const { replace, source } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();
  const brand = useOptionalBrand();
  const skipReload = searchParams.get('skipReload') === '1';
  const isFromApp = normalizeSource(source) === 'app';

  const { method, submit, isPending } = useHairConsultationForm();

  const { isDirty } = method.formState;

  const handlePageReload = (savedContent: WritingStep<HairConsultationFormValues>) => {
    if (!savedContent) return;

    const normalizedContent = normalizeHairConsultationContent(savedContent.content);
    const hasLostImages = hasLostHairConsultationImages(savedContent.content, normalizedContent);
    if (hasLostImages && !hasShownLostImageNoticeRef.current) {
      showSnackBar({
        type: 'error',
        message: '임시저장에서는 사진이 유지되지 않아 다시 첨부가 필요해요.',
      });
      hasShownLostImageNoticeRef.current = true;
    }

    setCurrentStep(savedContent.step);
    method.reset(normalizedContent);
  };

  const { leaveForm } = usePostFormNavigation({
    onSavedContentReload: handlePageReload,
    type: USER_WRITING_CONTENT_KEYS.hairConsultation,
    skipReload,
    onBack: isFromApp ? () => closeAppWebView('close') : undefined,
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
    replace(brand ? ROUTES.WEB_POSTS_CREATE(brand.config.slug) : ROUTES.POSTS_CREATE);
  }, [brand, replace, skipReload]);

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
