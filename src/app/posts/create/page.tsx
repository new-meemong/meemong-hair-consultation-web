'use client';

import { POST_TAB_VALUES, POST_TABS } from '@/features/posts/constants/post-tabs';
import { useCreatePost } from '@/features/posts/hooks/use-create-post';
import PostForm from '@/features/posts/ui/post-form';
import type { PostFormValues } from '@/features/posts/types/post-form-values';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';
import { useState } from 'react';
import ConsultingPostForm from '@/features/posts/ui/consulting-post-form';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

const tabs = POST_TABS.reverse();

export default function CreatePostPage() {
  useGuidePopup(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const [selectedTab, setSelectedTab] = useState<ValueOf<typeof POST_TAB_VALUES>>(tabs[0].value);

  const showModal = useShowModal();

  const handleTabChange = (tab: ValueOf<typeof POST_TAB_VALUES>) => {
    if (tab === POST_TAB_VALUES.GENERAL) {
      showModal({
        id: 'create-post-confirm-modal',
        text: '일반 상담글로 전환하시겠습니까?\n작성 중인 내용은 자동 저장됩니다.',
        positiveButton: {
          label: '나가기',
          textColor: 'text-negative',
          onClick: () => {
            //TODO: 작성 중인 내용 저장
            setSelectedTab(tab);
          },
        },
        negativeButton: {
          label: '취소',
        },
      });

      return;
    }

    setSelectedTab(tab);
  };

  const { replace } = useRouterWithUser();

  const { handleCreatePost, isPending } = useCreatePost();

  const { showSnackBar } = useOverlayContext();

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
      <SiteHeader title="게시글 작성" showBackButton />
      <Tab options={tabs} value={selectedTab} onChange={handleTabChange} />
      {renderForm(selectedTab)}
    </div>
  );
}
