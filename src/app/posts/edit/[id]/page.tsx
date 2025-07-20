'use client';

import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { POST_FORM_FIELD_NAME } from '@/features/posts/constants/post-form-field-name';
import useEditPost from '@/features/posts/hooks/use-edit-post';
import useShowEditPostConfirmModal from '@/features/posts/hooks/use-show-edit-post-confirm-modal';
import type { PostFormValues } from '@/features/posts/types/post-form-values';
import PostForm from '@/features/posts/ui/post-form';
import { ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowConfirmModal from '@/shared/ui/hooks/use-show-confirm-modal';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';

export default function EditPostPage() {
  const { replace } = useRouterWithUser();

  const { id: postId } = useParams();

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const { editPost, isPending } = useEditPost(postId?.toString() ?? '');

  const showEditPostConfirmModal = useShowEditPostConfirmModal();
  const showConfirmModal = useShowConfirmModal();

  if (!postDetail) return null;

  const initialData = {
    [POST_FORM_FIELD_NAME.title]: postDetail.title,
    [POST_FORM_FIELD_NAME.content]: postDetail.content,
    [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: true,
    [POST_FORM_FIELD_NAME.imageUrls]: postDetail.images,
    [POST_FORM_FIELD_NAME.imageFiles]: [],
  };

  const handleSubmit = (data: PostFormValues) => {
    const handleEdit = () => {
      editPost(data, {
        onSuccess: () => {
          showConfirmModal({
            text: '수정이 완료되었습니다',
            onConfirm: () => {
              replace(ROUTES.POSTS_DETAIL(postDetail.id));
            },
          });
        },
      });
    };

    showEditPostConfirmModal({
      onEdit: handleEdit,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader title="게시글 수정" showBackButton />
      <PostForm initialData={initialData} onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
