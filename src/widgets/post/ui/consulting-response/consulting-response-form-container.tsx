import { useCallback, useEffect, useState } from 'react';

import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-response-form-field-name';
import { PostDetailProvider } from '@/features/posts/context/post-detail-context';
import type { ConsultingResponseFormValues } from '@/features/posts/types/consulting-response-form-values';
import ConsultingResponseForm from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-form';

import { SiteHeader } from '@/widgets/header';

import ConsultingResponseSidebar from '../consulting-response-sidebar/consulting-response-sidebar';

type ConsultingResponseFormContainerProps = {
  method: UseFormReturn<ConsultingResponseFormValues>;
  responseId?: string;
  onBackClick: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export default function ConsultingResponseFormContainer({
  method,
  responseId,
  onBackClick,
  currentStep,
  setCurrentStep,
}: ConsultingResponseFormContainerProps) {
  const [initialHeight] = useState(() => window.innerHeight);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isEdit = !!responseId;
  const title = `컨설팅 답변 ${isEdit ? '수정' : '작성'}`;

  const postId = method.getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID);

  const handleCustomBackAction = useCallback(() => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      return;
    }

    if (currentStep !== 1) {
      setCurrentStep(currentStep - 1);
      return;
    }

    onBackClick();
  }, [currentStep, isSidebarOpen, onBackClick, setCurrentStep]);

  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isAndroid) {
      window.customBackAction = function () {
        handleCustomBackAction();
      };
      window.setCustomBackAction(true);
    }

    return () => {
      if (isAndroid) {
        window.setCustomBackAction(false);
        window.customBackAction = null;
      }
    };
  }, [handleCustomBackAction]);

  return (
    <div
      className="h-screen bg-white flex flex-col overflow-x-hidden"
      style={{ minHeight: initialHeight }}
    >
      <PostDetailProvider postId={postId}>
        <FormProvider {...method}>
          <SiteHeader title={title} showBackButton onBackClick={onBackClick} />
          <ConsultingResponseForm
            method={method}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            responseId={responseId}
          />
          <ConsultingResponseSidebar
            postId={postId}
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
          />
        </FormProvider>
      </PostDetailProvider>
    </div>
  );
}
