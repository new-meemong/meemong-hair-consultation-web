import { useCallback } from 'react';

import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';


import useDeletePostMutation from '../api/use-delete-post-mutation';
import { usePostDetail } from '../context/post-detail-context';

export default function useDeletePost(postId: string) {
  const showModal = useShowModal();
  const { push } = useRouterWithUser();

  const { postDetail } = usePostDetail();

  const { mutate: deletePost } = useDeletePostMutation();

  const activePostTab = postDetail.consultType;

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
                  push(ROUTES.POSTS, {
                    [SEARCH_PARAMS.POST_TAB]: activePostTab,
                  });
                },
              },
            ],
          });
        },
      }),
    [deletePost, postId, showModal, push, activePostTab],
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
