import { ROUTES, closeAppWebView, normalizeSource } from '@/shared';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useCallback } from 'react';
import useDeleteHairConsultationMutation from '../api/use-delete-hair-consultation-mutation';
import { usePostDetail } from '../context/post-detail-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

export default function useDeletePost(postId: string) {
  const showModal = useShowModal();
  const { push, source } = useRouterWithUser();

  const { postDetail } = usePostDetail();
  const { mutate: deleteNewPost } = useDeleteHairConsultationMutation();

  const activePostTab = postDetail.consultType;

  const handleDeleteConfirm = useCallback(
    () =>
      deleteNewPost(Number(postId), {
        onSuccess: () => {
          showModal({
            id: 'delete-post-confirm-modal',
            text: '삭제가 완료되었습니다.',
            buttons: [
              {
                label: '확인',
                onClick: () => {
                  if (normalizeSource(source) === 'app') {
                    // 앱 전체화면 WebView에서 삭제 시 Flutter 페이지를 pop하여
                    // 탭이 있는 헤어상담 메인으로 복귀
                    closeAppWebView('close');
                  } else {
                    push(ROUTES.POSTS, {
                      [SEARCH_PARAMS.POST_TAB]: activePostTab,
                    });
                  }
                },
              },
            ],
          });
        },
      }),
    [deleteNewPost, postId, showModal, push, activePostTab, source],
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
