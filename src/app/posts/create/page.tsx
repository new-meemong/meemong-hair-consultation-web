'use client';

import { useState } from 'react';

import { FormProvider } from 'react-hook-form';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { POST_TABS } from '@/features/posts/constants/post-tabs';
import useConsultingPostForm from '@/features/posts/hooks/use-consulting-post-form';
import { useCreatePost } from '@/features/posts/hooks/use-create-post';
import usePostFormNavigation from '@/features/posts/hooks/use-post-form-navigation';
import type { ConsultingPostFormValues } from '@/features/posts/types/consulting-post-form-values';
import type { PostFormValues } from '@/features/posts/types/post-form-values';
import type { WritingStep } from '@/features/posts/types/user-writing-content';
import ConsultingPostForm from '@/features/posts/ui/consulting-form/consulting-post-form/consulting-post-form';
import PostForm from '@/features/posts/ui/post-form/post-form';
import { ROUTES } from '@/shared';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowGuide from '@/shared/hooks/use-show-guide';
import type { ValueOf } from '@/shared/type/types';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';

export default function CreatePostPage() {
  useShowGuide(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const [initialHeight] = useState(() => window.innerHeight);

  const { replace } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();

  const [currentStep, setCurrentStep] = useState(1);

  const { method, submit: submitConsultingForm } = useConsultingPostForm();

  const { isDirty } = method.formState;

  const handlePageReload = (savedContent: WritingStep<ConsultingPostFormValues>) => {
    if (!savedContent) return;

    setCurrentStep(savedContent.step);
    method.reset(savedContent.content);
  };

  const { selectedTab, leaveForm, changeTab } = usePostFormNavigation({
    onSavedContentReload: handlePageReload,
  });

  const handleBackClick = () => {
    const writingContent: WritingStep<ConsultingPostFormValues> = {
      step: currentStep,
      content: method.getValues(),
    };

    leaveForm(writingContent, isDirty);
  };

  const handleTabChange = (type: ValueOf<typeof CONSULT_TYPE>) => {
    const writingContent: WritingStep<ConsultingPostFormValues> = {
      step: currentStep,
      content: method.getValues(),
    };

    changeTab(type, writingContent);
  };

  const { handleCreatePost, isPending } = useCreatePost();

  const handleSubmit = (data: PostFormValues) => {
    handleCreatePost(data, {
      onSuccess: () => {
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });
        replace(ROUTES.POSTS, {
          [SEARCH_PARAMS.POST_TAB]: selectedTab,
        });
      },
    });
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
        return <PostForm onSubmit={handleSubmit} isPending={isPending} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col min-h-0" style={{ minHeight: initialHeight }}>
      <FormProvider {...method}>
        <SiteHeader title="게시글 작성" showBackButton onBackClick={handleBackClick} />
        <Tab options={POST_TABS} value={selectedTab} onChange={handleTabChange} />
        {renderForm(selectedTab)}
      </FormProvider>
    </div>
  );
}
