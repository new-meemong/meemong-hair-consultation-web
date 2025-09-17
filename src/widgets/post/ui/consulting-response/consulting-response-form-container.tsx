import { useState } from 'react';

import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { CONSULTING_RESPONSE_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-response-form-field-name';
import { PostDetailProvider } from '@/features/posts/context/post-detail-context';
import type { ConsultingResponseFormValues } from '@/features/posts/types/consulting-response-form-values';
import ConsultingResponseForm from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-form';
import ConsultingResponseSidebarButton from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-sidebar/consulting-response-sidebar-button';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useShowGuide from '@/shared/hooks/use-show-guide';
import { SiteHeader } from '@/widgets/header';

import ConsultingResponseSidebar from '../consulting-response-sidebar/consulting-response-sidebar';

import ConsultingResponseSidebarGuideTooltip from './consulting-response-sidebar-guide-tooltip';

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

  const isEdit = !!responseId;
  const title = `컨설팅 답변 ${isEdit ? '수정' : '작성'}`;

  const [showedSidebar, setShowedSidebar] = useState(false);

  const { shouldShowGuide, closeGuide } = useShowGuide(
    USER_GUIDE_KEYS.hasSeenConsultingResponseSidebarGuide,
  );

  const handleSidebarButtonClick = () => {
    setShowedSidebar((prev) => !prev);
    closeGuide();
  };

  const postId = method.getValues(CONSULTING_RESPONSE_FORM_FIELD_NAME.POST_ID);

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
            isOpen={showedSidebar}
            onClose={handleSidebarButtonClick}
            postId={postId}
          />
          <div className="absolute bottom-26 right-5">
            <div className="flex flex-col items-end gap-4.25">
              {shouldShowGuide && <ConsultingResponseSidebarGuideTooltip />}
              <ConsultingResponseSidebarButton onClick={handleSidebarButtonClick} />
            </div>
          </div>
        </FormProvider>
      </PostDetailProvider>
    </div>
  );
}
