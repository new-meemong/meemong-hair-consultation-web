'use client';

import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import useEditPost from '@/features/posts/hooks/use-edit-post';
import useShowEditPostConfirmModal from '@/features/posts/hooks/use-show-edit-post-confirm-modal';
import PostForm, { POST_FORM_FIELD_NAME, type PostFormValues } from '@/features/posts/ui/post-form';
import { ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowConfirmModal from '@/shared/ui/hooks/use-show-confirm-modal';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';

export default function EditPostPage() {
  const { replace } = useRouterWithUser();

  const { editPost, isPending } = useEditPost();

  const showEditPostConfirmModal = useShowEditPostConfirmModal();
  const showConfirmModal = useShowConfirmModal();

  const { id: postId } = useParams();

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  if (!postDetail) return null;

  const initialData = {
    [POST_FORM_FIELD_NAME.title]: postDetail.title,
    [POST_FORM_FIELD_NAME.content]: postDetail.content,
    // [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: postDetail.isPhotoVisibleToDesigner,
    [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: true,
    [POST_FORM_FIELD_NAME.imageUrls]: postDetail.images,
    [POST_FORM_FIELD_NAME.imageFiles]: [],
  };

  const handleSubmit = (data: PostFormValues) => {
    const handleEdit = () => {
      editPost(postDetail.id, data, {
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
