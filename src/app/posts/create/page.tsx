'use client';

import { useCreatePost } from '@/features/posts/hooks/use-create-post';
import PostForm, { type PostFormValues } from '@/features/posts/ui/post-form';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { SiteHeader } from '@/widgets/header';

export default function CreatePostPage() {
  useGuidePopup(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader title="게시글 작성" showBackButton />
      <PostForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
