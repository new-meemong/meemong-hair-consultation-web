'use client';

import { POST_TAB_VALUES, POST_TABS } from '@/features/posts/constants/post-tabs';
import { useCreatePost } from '@/features/posts/hooks/use-create-post';
import PostForm, { type PostFormValues } from '@/features/posts/ui/post-form';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';
import Tab from '@/shared/ui/tab';
import { SiteHeader } from '@/widgets/header';
import { useState } from 'react';

const tabs = POST_TABS.reverse();

export default function CreatePostPage() {
  useGuidePopup(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const [selectedTab, setSelectedTab] = useState<ValueOf<typeof POST_TAB_VALUES>>(tabs[0].value);

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

  console.log('tabs', tabs);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader title="게시글 작성" showBackButton />
      <Tab options={tabs} value={selectedTab} onChange={setSelectedTab} />
      <PostForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
