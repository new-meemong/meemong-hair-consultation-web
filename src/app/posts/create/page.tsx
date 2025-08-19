'use client';

import { useEffect, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { CONSULTING_POST_FORM_FIELD_NAME } from '@/features/posts/constants/consulting-post-form-field-name';
import { HAIR_CONCERN_OPTION_VALUE } from '@/features/posts/constants/hair-concern-option';
import { POST_TABS, POST_TAB_VALUE } from '@/features/posts/constants/post-tabs';
import { useCreateConsultingPost } from '@/features/posts/hooks/use-create-consulting-post';
import { useCreatePost } from '@/features/posts/hooks/use-create-post';
import { usePostTab } from '@/features/posts/hooks/use-post-tab';
import useShowLeaveCreateConsultingPostModal from '@/features/posts/hooks/use-show-leave-create-consulting-post';
import useShowLeaveCreateGeneralPostModal from '@/features/posts/hooks/use-show-leave-create-general-post-modal';
import useShowReloadConsultingPostModal from '@/features/posts/hooks/use-show-reload-consulting-post-modal';
import {
  consultingPostFormSchema,
  type ConsultingPostFormValues,
} from '@/features/posts/types/consulting-post-form-values';
import type { PostFormValues } from '@/features/posts/types/post-form-values';
import ConsultingPostForm from '@/features/posts/ui/consulting-form/consulting-post-form/consulting-post-form';
import PostForm from '@/features/posts/ui/post-form/post-form';
import { USER_GUIDE_KEYS, USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';
import { ROUTES } from '@/shared/lib/routes';
import type { ValueOf } from '@/shared/type/types';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';

export default function CreatePostPage() {
  useGuidePopup(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const { replace, back } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();

  const [selectedTab, setSelectedTab] = usePostTab();

  const handleCloseReloadConsultingPostModal = () => {
    setSelectedTab(POST_TAB_VALUE.GENERAL);
  };

  const showReloadConsultingPostModal = useShowReloadConsultingPostModal({
    onClose: handleCloseReloadConsultingPostModal,
    onPositive: () => {
      if (!savedContent) return;

      method.reset(savedContent);
    },
    onNegative: () => {
      saveContent(null);
    },
  });

  const method = useForm<ConsultingPostFormValues>({
    resolver: zodResolver(consultingPostFormSchema),
    defaultValues: {
      [CONSULTING_POST_FORM_FIELD_NAME.CONCERN]: {
        value: HAIR_CONCERN_OPTION_VALUE.DESIGN_POSSIBLE,
        additional: '',
      },
      [CONSULTING_POST_FORM_FIELD_NAME.TREATMENTS]: [],
      [CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES]: [],
      [CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES]: {
        images: [],
        description: '',
      },
      [CONSULTING_POST_FORM_FIELD_NAME.CONTENT]: '',
      [CONSULTING_POST_FORM_FIELD_NAME.TITLE]: '',
    },
  });

  const { getSavedContent, saveContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.consultingPost,
  );

  const [initialize, setInitialize] = useState(false);
  const savedContent = getSavedContent();
  const hasSavedConsultingPost = savedContent !== null;

  useEffect(() => {
    if (hasSavedConsultingPost && !initialize) {
      showReloadConsultingPostModal();
    }
    setInitialize(true);
  }, [
    hasSavedConsultingPost,
    saveContent,
    showReloadConsultingPostModal,
    initialize,
    savedContent,
    method,
  ]);

  const showLeaveCreateConsultingPostModal = useShowLeaveCreateConsultingPostModal();
  const showLeaveCreateGeneralPostModal = useShowLeaveCreateGeneralPostModal();

  console.log('method.formState.isDirty', method.formState.isDirty);

  const handleBackClick = () => {
    if (selectedTab === POST_TAB_VALUE.CONSULTING) {
      if (!method.formState.isDirty) {
        back();
        return;
      }

      showLeaveCreateConsultingPostModal({
        onClose: () => {
          back();
          saveContent(method.getValues());
        },
      });
      return;
    }

    if (selectedTab === POST_TAB_VALUE.GENERAL) {
      showLeaveCreateGeneralPostModal();
      return;
    }

    back();
  };

  const handleTabChange = (tab: ValueOf<typeof POST_TAB_VALUE>) => {
    if (tab === POST_TAB_VALUE.GENERAL && hasSavedConsultingPost) {
      showLeaveCreateConsultingPostModal({
        onClose: () => {
          setSelectedTab(tab);
          saveContent(method.getValues());
        },
      });
      return;
    }

    if (tab === POST_TAB_VALUE.CONSULTING && hasSavedConsultingPost) {
      showReloadConsultingPostModal({ onFinish: () => setSelectedTab(tab) });
      return;
    }

    setSelectedTab(tab);
  };

  const { handleCreatePost, isPending } = useCreatePost();

  const handleSubmit = (data: PostFormValues) => {
    handleCreatePost(data, {
      onSuccess: () => {
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });
        replace('/posts');
      },
    });
  };

  const { handleCreateConsultingPost } = useCreateConsultingPost();

  const submitConsultingForm = (values: ConsultingPostFormValues) => {
    handleCreateConsultingPost(values, {
      onSuccess: () => {
        saveContent(null);
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });
        replace(ROUTES.POSTS);
      },
    });
  };

  const renderForm = (type: ValueOf<typeof POST_TAB_VALUE>) => {
    switch (type) {
      case POST_TAB_VALUE.CONSULTING:
        return <ConsultingPostForm onSubmit={submitConsultingForm} />;
      case POST_TAB_VALUE.GENERAL:
        return <PostForm onSubmit={handleSubmit} isPending={isPending} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FormProvider {...method}>
        <SiteHeader title="게시글 작성" showBackButton onBackClick={handleBackClick} />
        <Tab options={POST_TABS} value={selectedTab} onChange={handleTabChange} />
        {renderForm(selectedTab)}
      </FormProvider>
    </div>
  );
}
