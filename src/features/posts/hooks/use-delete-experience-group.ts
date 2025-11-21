import { useCallback } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

import { ROUTES } from '@/shared';

import useDeleteExperienceGroupMutation from '../api/use-delete-experience-group-mutation';

export default function useDeleteExperienceGroup(experienceGroupId: string) {
  const showModal = useShowModal();
  const { push } = useRouterWithUser();

  const { mutate: deleteExperienceGroup } = useDeleteExperienceGroupMutation();

  const handleDeleteConfirm = useCallback(
    () =>
      deleteExperienceGroup(experienceGroupId, {
        onSuccess: () => {
          showModal({
            id: 'delete-post-confirm-modal',
            text: '삭제가 완료되었습니다.',
            buttons: [
              {
                label: '확인',
                onClick: () => {
                  push(ROUTES.POSTS, {
                    [SEARCH_PARAMS.POST_TAB]: CONSULT_TYPE.EXPERIENCE_GROUP,
                  });
                },
              },
            ],
          });
        },
      }),
    [deleteExperienceGroup, experienceGroupId, showModal, push],
  );

  const handleDelete = useCallback(() => {
    if (!experienceGroupId) return;

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
  }, [experienceGroupId, showModal, handleDeleteConfirm]);

  return {
    handleDelete,
  };
}
