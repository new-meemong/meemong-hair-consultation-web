import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ROUTES } from '@/shared/lib/routes';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

import type { PostFormValues } from '../types/post-form-values';

import { useCreatePost } from './use-create-post';
import useEditPost from './use-edit-post';

export default function useSubmitPostForm(postId?: number) {
  const { replace } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();

  const showModal = useShowModal();

  const { createPost, isPending: isCreatingPost } = useCreatePost();

  const handleCreatePost = (data: PostFormValues) => {
    createPost(data, {
      onSuccess: () => {
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });
        replace(ROUTES.POSTS, {
          [SEARCH_PARAMS.POST_TAB]: CONSULT_TYPE.GENERAL,
        });
      },
    });
  };

  const { editPost, isPending: isEditingPost } = useEditPost(postId?.toString() ?? '');

  const handleEditPost = (data: PostFormValues) => {
    if (!postId) return;

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
                  replace(ROUTES.POSTS_DETAIL(postId));
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

  const submit = postId ? handleEditPost : handleCreatePost;

  return { submit, isPending: isCreatingPost || isEditingPost };
}
