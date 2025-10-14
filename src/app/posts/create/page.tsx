'use client';

import { useState } from 'react';

import { FormProvider } from 'react-hook-form';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import useConsultingPostForm from '@/features/posts/hooks/use-consulting-post-form';
import usePostFormNavigation from '@/features/posts/hooks/use-post-form-navigation';
import { usePostTab } from '@/features/posts/hooks/use-post-tab';
import type { ConsultingPostFormValues } from '@/features/posts/types/consulting-post-form-values';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import ConsultingPostForm from '@/features/posts/ui/consulting-form/consulting-post-form/consulting-post-form';
import PostForm from '@/features/posts/ui/post-form/post-form';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useShowGuide from '@/shared/hooks/use-show-guide';
import type { ValueOf } from '@/shared/type/types';
import { SiteHeader } from '@/widgets/header';

export default function CreatePostPage() {
  useShowGuide(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const [initialHeight] = useState(() => window.innerHeight);

  const [selectedTab] = usePostTab();

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
  });

  const handleBackClick = () => {
    const writingContent: WritingStep<ConsultingPostFormValues> = {
      step: currentStep,
      content: method.getValues(),
    };

    leaveForm(writingContent, isDirty);
  };

  const renderForm = (type: ValueOf<typeof CONSULT_TYPE>) => {
    switch (type) {
      case CONSULT_TYPE.CONSULTING:
        return (
          <ConsultingPostForm
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onSubmit={submitConsultingForm}
          />
        );
      case CONSULT_TYPE.GENERAL:
        return <PostForm />;
      default:
        return null;
    }
  };

  const getTitle = (type: ValueOf<typeof CONSULT_TYPE>) => {
    switch (type) {
      case CONSULT_TYPE.CONSULTING:
        return '상담지 작성';
      case CONSULT_TYPE.GENERAL:
        return '일반글 작성';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col min-h-0" style={{ minHeight: initialHeight }}>
      <FormProvider {...method}>
        <SiteHeader title={getTitle(selectedTab)} showBackButton onBackClick={handleBackClick} />
        {renderForm(selectedTab)}
      </FormProvider>
    </div>
  );
}
