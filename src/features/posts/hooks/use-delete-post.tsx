import useShowModal from '@/shared/ui/hooks/use-show-modal';
import useDeletePostMutation from '../api/use-delete-post-mutation';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ROUTES } from '@/shared';
import { useCallback } from 'react';

export default function useDeletePost(postId: string) {
  const showModal = useShowModal();
  const { push } = useRouterWithUser();

  const { mutate: deletePost } = useDeletePostMutation();

  const handleDeleteConfirm = useCallback(
    () =>
      deletePost(Number(postId), {
        onSuccess: () => {
          showModal({
            id: 'delete-post-confirm-modal',
            text: '삭제가 완료되었습니다.',
            buttons: [
              {
                label: '확인',
                onClick: () => {
                  push(ROUTES.POSTS);
                },
              },
            ],
          });
        },
      }),
    [deletePost, postId, showModal, push],
  );

  const handleDeletePost = useCallback(() => {
    if (!postId) return;

    showModal({
      id: 'delete-post-confirm-modal',
      text: '해당 게시글을 삭제하시겠습니까?',
      buttons: [
        {
          label: '삭제',
          onClick: handleDeleteConfirm,
        },
        {
          label: '취소',
        },
      ],
    });
  }, [postId, showModal, handleDeleteConfirm]);

  return {
    handleDeletePost,
  };
}
