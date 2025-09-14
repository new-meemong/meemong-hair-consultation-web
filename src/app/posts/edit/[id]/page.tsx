'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { POST_FORM_FIELD_NAME } from '@/features/posts/constants/post-form-field-name';
import useEditPost from '@/features/posts/hooks/use-edit-post';
import type { PostFormValues } from '@/features/posts/types/post-form-values';
import PostForm from '@/features/posts/ui/post-form/post-form';
import { ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import { SiteHeader } from '@/widgets/header';

export default function EditPostPage() {
  const [initialHeight] = useState(() => window.innerHeight);

  const { replace } = useRouterWithUser();

  const { id: postId } = useParams();

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const { editPost, isPending } = useEditPost(postId?.toString() ?? '');

  const showModal = useShowModal();

  if (!postDetail) return null;

  const initialData = {
    [POST_FORM_FIELD_NAME.title]: postDetail.title,
    [POST_FORM_FIELD_NAME.content]: postDetail.content,
    [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: postDetail.isPhotoVisibleToDesigner,
    [POST_FORM_FIELD_NAME.imageUrls]: postDetail.images ?? [],
    [POST_FORM_FIELD_NAME.imageFiles]: [],
  };

  const handleSubmit = (data: PostFormValues) => {
    const handleEdit = () => {
      editPost(data, {
        onSuccess: () => {
          showModal({
            id: 'edit-post-confirm-modal',
            text: '수정이 완료되었습니다',
            buttons: [
              {
                label: '확인',
                onClick: () => {
                  replace(ROUTES.POSTS_DETAIL(postDetail.id));
                },
              },
            ],
          });
        },
      });
    };

    showModal({
      id: 'edit-post-confirm-modal',
      text: '해당 게시글을 수정하시겠습니까?',
      buttons: [
        {
          label: '수정하기',
          onClick: handleEdit,
        },
        {
          label: '취소',
        },
      ],
    });
  };

  return (
    <div className="h-screen min-h-0 bg-white flex flex-col" style={{ minHeight: initialHeight }}>
      <SiteHeader title="게시글 수정" showBackButton />
      <PostForm initialData={initialData} onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
