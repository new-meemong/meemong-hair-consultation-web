'use client';

import { useEffect, useState } from 'react';

import { POST_TABS, POST_TAB_VALUES } from '@/features/posts/constants/post-tabs';
import { useCreatePost } from '@/features/posts/hooks/use-create-post';
import useShowLeaveCreateConsultingPostModal from '@/features/posts/hooks/use-show-leave-create-consulting-post';
import useShowLeaveCreateGeneralPostModal from '@/features/posts/hooks/use-show-leave-create-general-post-modal';
import useShowReloadConsultingPostModal from '@/features/posts/hooks/use-show-reload-consulting-post-modal';
import type { PostFormValues } from '@/features/posts/types/post-form-values';
import ConsultingPostForm from '@/features/posts/ui/consulting-form/consulting-post-form/consulting-post-form';
import PostForm from '@/features/posts/ui/post-form/post-form';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';

export default function CreatePostPage() {
  useGuidePopup(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const { replace, back } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();

  const [selectedTab, setSelectedTab] = useState<ValueOf<typeof POST_TAB_VALUES>>(
    POST_TABS[0].value,
  );

  const showReloadConsultingPostModal = useShowReloadConsultingPostModal();
  //TODO: 작성하던 데이터 저장 여부 로직 추가
  const [hasSavedConsultingPost, setHasSavedConsultingPost] = useState(true);

  const handleCloseReloadConsultingPostModal = () => {
    setSelectedTab(POST_TAB_VALUES.GENERAL);
  };

  useEffect(() => {
    if (hasSavedConsultingPost) {
      showReloadConsultingPostModal({ onClose: handleCloseReloadConsultingPostModal });
      setHasSavedConsultingPost(false);
    }
  }, [hasSavedConsultingPost, showReloadConsultingPostModal]);

  const showLeaveCreateConsultingPostModal = useShowLeaveCreateConsultingPostModal();
  const showLeaveCreateGeneralPostModal = useShowLeaveCreateGeneralPostModal();

  const handleBackClick = () => {
    if (selectedTab === POST_TAB_VALUES.CONSULTING) {
      showLeaveCreateConsultingPostModal();
      return;
    }

    if (selectedTab === POST_TAB_VALUES.GENERAL) {
      showLeaveCreateGeneralPostModal();
      return;
    }

    back();
  };

  const handleTabChange = (tab: ValueOf<typeof POST_TAB_VALUES>) => {
    if (tab === POST_TAB_VALUES.GENERAL && hasSavedConsultingPost) {
      showLeaveCreateConsultingPostModal();
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

  const renderForm = (type: ValueOf<typeof POST_TAB_VALUES>) => {
    switch (type) {
      case POST_TAB_VALUES.CONSULTING:
        return <ConsultingPostForm />;
      case POST_TAB_VALUES.GENERAL:
        return <PostForm onSubmit={handleSubmit} isPending={isPending} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader title="게시글 작성" showBackButton onBackClick={handleBackClick} />
      <Tab options={POST_TABS} value={selectedTab} onChange={handleTabChange} />
      {renderForm(selectedTab)}
    </div>
  );
}
