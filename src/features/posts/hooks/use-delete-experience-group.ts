import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { closeAppWebView, normalizeSource } from '@/shared/lib/app-bridge';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

import useDeleteExperienceGroupMutation from '../api/use-delete-experience-group-mutation';

const EXPERIENCE_GROUP_DELETED_CLOSE_MESSAGE = {
  type: 'close',
  target: 'experienceGroupMyList',
} as const;

export default function useDeleteExperienceGroup(experienceGroupId: string) {
  const showModal = useShowModal();
  const { push, source } = useRouterWithUser();
  const searchParams = useSearchParams();
  const supportsExperienceGroupListReturn =
    searchParams.get(SEARCH_PARAMS.SUPPORTS_EXPERIENCE_GROUP_LIST_RETURN) === 'true';

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
                  if (
                    normalizeSource(source) === 'app' &&
                    closeAppWebView(
                      supportsExperienceGroupListReturn
                        ? EXPERIENCE_GROUP_DELETED_CLOSE_MESSAGE
                        : 'close',
                    )
                  ) {
                    return;
                  }
                  push(ROUTES.POSTS, {
                    [SEARCH_PARAMS.POST_TAB]: CONSULT_TYPE.EXPERIENCE_GROUP,
                    [SEARCH_PARAMS.POST_LIST_TAB]: 'my',
                  });
                },
              },
            ],
          });
        },
      }),
    [
      deleteExperienceGroup,
      experienceGroupId,
      showModal,
      push,
      source,
      supportsExperienceGroupListReturn,
    ],
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
