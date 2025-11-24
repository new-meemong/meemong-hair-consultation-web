'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';


import useConsultingResponseForm from '@/features/posts/hooks/use-consulting-response-form';
import useConsultingResponseNavigation from '@/features/posts/hooks/use-consulting-response-navigation';
import type { ConsultingResponseFormValues } from '@/features/posts/types/consulting-response-form-values';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import ConsultingResponseFormContainer from '@/widgets/post/ui/consulting-response/consulting-response-form-container';

export default function CreateConsultingPostPage() {
  const { postId } = useParams();

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

  return (
    <ConsultingResponseFormContainer
      method={method}
      onBackClick={handleBackClick}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
    />
  );
}
