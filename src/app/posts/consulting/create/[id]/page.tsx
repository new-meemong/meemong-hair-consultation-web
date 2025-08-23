'use client';

import { useState } from 'react';

import { FormProvider } from 'react-hook-form';

import { useParams } from 'next/navigation';

import { PostDetailProvider } from '@/features/posts/context/post-detail-context';
import useConsultingResponseForm from '@/features/posts/hooks/use-consulting-response-form';
import useConsultingResponseNavigation from '@/features/posts/hooks/use-consulting-response-navigation';
import type { ConsultingResponseFormValues } from '@/features/posts/types/consulting-response-form-values';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import ConsultingResponseForm from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-form';
import ConsultingResponseSidebarButton from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-sidebar/consulting-response-sidebar-button';
import { SiteHeader } from '@/widgets/header';
import ConsultingResponseSidebar from '@/widgets/post/ui/consulting-response-sidebar/consulting-response-sidebar';

export default function CreateConsultingPostPage() {
  const { id: postId } = useParams();

  const { method } = useConsultingResponseForm();

  const [currentStep, setCurrentStep] = useState(1);

  const handlePageReload = (savedContent: WritingStep<ConsultingResponseFormValues>) => {
    if (!savedContent) return;

    setCurrentStep(savedContent.step);
    method.reset(savedContent.content);
  };

  const { isDirty } = method.formState;

  const { leaveForm } = useConsultingResponseNavigation({
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

  const [showedSidebar, setShowedSidebar] = useState(false);

  const handleSidebarButtonClick = () => {
    setShowedSidebar((prev) => !prev);
  };

  if (!postId) return null;

  return (
    <div className="h-screen bg-white flex flex-col min-h-0 overflow-x-hidden">
      <PostDetailProvider postId={postId.toString()}>
        <FormProvider {...method}>
          <SiteHeader title="컨설팅 답변 작성" showBackButton onBackClick={handleBackClick} />
          <ConsultingResponseForm
            method={method}
            hairConsultPostingId={postId.toString()}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
          <ConsultingResponseSidebar
            isOpen={showedSidebar}
            onClose={handleSidebarButtonClick}
            postId={postId.toString()}
          />
          <div className="absolute bottom-26 right-5">
            <ConsultingResponseSidebarButton onClick={handleSidebarButtonClick} />
          </div>
        </FormProvider>
      </PostDetailProvider>
    </div>
  );
}
