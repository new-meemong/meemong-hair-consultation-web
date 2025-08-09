'use client';

import { useEffect, useState } from 'react';

import { POST_TABS, POST_TAB_VALUES } from '@/features/posts/constants/post-tabs';
import { useCreatePost } from '@/features/posts/hooks/use-create-post';
import useShowReloadConsultingPostModal from '@/features/posts/hooks/use-show-reload-consulting-post-modal';
import type { PostFormValues } from '@/features/posts/types/post-form-values';
import ConsultingPostForm from '@/features/posts/ui/consulting-form/consulting-post-form/consulting-post-form';
import PostForm from '@/features/posts/ui/post-form/post-form';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';

export default function CreatePostPage() {
  useGuidePopup(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const showModal = useShowModal();
  const { replace, back } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();

  const showReloadConsultingPostModal = useShowReloadConsultingPostModal();
  //TODO: 작성하던 데이터 저장 여부 로직 추가
  const [hasSavedConsultingPost, setHasSavedConsultingPost] = useState(false);

  useEffect(() => {
    if (hasSavedConsultingPost) {
      showReloadConsultingPostModal();
      setHasSavedConsultingPost(false);
    }
  }, [hasSavedConsultingPost, showReloadConsultingPostModal]);

  const [selectedTab, setSelectedTab] = useState<ValueOf<typeof POST_TAB_VALUES>>(
    POST_TABS[0].value,
  );

  const handleBackClick = () => {
    if (selectedTab === POST_TAB_VALUES.CONSULTING) {
      showModal({
        id: 'go-back-confirm-modal',
        text: '컨설팅 글 작성을 그만두시겠습니까?\n작성 중인 내용은 자동 저장되며\n이어서 작성할 수 있습니다.',
        buttons: [
          {
            label: '나가기',
            textColor: 'text-negative',
            onClick: () => {
              back();
            },
          },
          {
            label: '취소',
          },
        ],
      });

      return;
    }

    back();
  };

  const handleTabChange = (tab: ValueOf<typeof POST_TAB_VALUES>) => {
    if (tab === POST_TAB_VALUES.GENERAL) {
      showModal({
        id: 'change-to-general-confirm-modal',
        text: '일반 상담글로 전환하시겠습니까?\n작성 중인 내용은 자동 저장됩니다.',
        buttons: [
          {
            label: '나가기',
            textColor: 'text-negative',
            onClick: () => {
              //TODO: 작성 중인 내용 저장
              setSelectedTab(tab);
            },
          },
          {
            label: '취소',
          },
        ],
      });

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
