import { useCallback, useEffect, useState } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-response-form-field-name';
import { NewPostDetailProvider } from '@/features/posts/context/post-detail-context';
import type { ConsultingResponseFormValues } from '@/features/posts/types/consulting-response-form-values';
import ConsultingResponseFormNew from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-form-new';
import { SiteHeader } from '@/widgets/header';

import ConsultingResponseSidebar from '../consulting-response-sidebar/consulting-response-sidebar';

type ConsultingResponseFormContainerNewProps = {
  method: UseFormReturn<ConsultingResponseFormValues>;
  onBackClick: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export default function ConsultingResponseFormContainerNew({
  method,
  onBackClick,
  currentStep,
  setCurrentStep,
}: ConsultingResponseFormContainerNewProps) {
  const [initialHeight] = useState(() => window.innerHeight);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <NewPostDetailProvider postId={postId}>
        <FormProvider {...method}>
          <SiteHeader title="컨설팅 답변 작성" showBackButton onBackClick={onBackClick} />
          <ConsultingResponseFormNew
            method={method}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
          <ConsultingResponseSidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
        </FormProvider>
      </NewPostDetailProvider>
    </div>
  );
}
