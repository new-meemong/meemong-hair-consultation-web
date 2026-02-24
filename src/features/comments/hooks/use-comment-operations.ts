import useShowModal from '@/shared/ui/hooks/use-show-modal';

import useCreateExperienceGroupCommentMutation from '../api/use-create-experience-group-comment-mutation';
import useDeleteExperienceGroupCommentMutation from '../api/use-delete-experience-group-comment-mutation';
import usePatchExperienceGroupCommentMutation from '../api/use-patch-experience-group-comment-mutation';
import type { CommentFormValues } from '../ui/comment-form';

type UseCommentOperationsProps = {
  experienceGroupId?: string;
  commentId?: number | null;
};

export default function useCommentOperations({
  commentId,
  experienceGroupId,
}: UseCommentOperationsProps) {
  const {
    mutate: createExperienceGroupCommentMutate,
    isPending: isExperienceGroupCommentCreating,
  } = useCreateExperienceGroupCommentMutation({ experienceGroupId: experienceGroupId ?? '' });
  const {
    mutate: updateExperienceGroupCommentMutate,
    isPending: isExperienceGroupCommentUpdating,
  } = usePatchExperienceGroupCommentMutation({
    experienceGroupId: experienceGroupId ?? '',
    commentId: commentId?.toString() ?? '',
  });
  const { mutate: deleteExperienceGroupCommentMutate } = useDeleteExperienceGroupCommentMutation(
    experienceGroupId ?? '',
  );

  const showModal = useShowModal();

  const handleCreate = (data: CommentFormValues, onSuccess: () => void) => {
    if (experienceGroupId) {
      createExperienceGroupCommentMutate(
        {
          content: data.content,
          parentId: data.parentCommentId ? Number(data.parentCommentId) : undefined,
          experienceGroupId: Number(experienceGroupId),
        },
        { onSuccess },
      );
    }
  };

  const handleUpdate = (content: string, onSuccess: () => void) => {
    updateExperienceGroupCommentMutate({ content }, { onSuccess });
  };

  const handleDelete = (commentId: number) => {
    showModal({
      id: 'delete-comment-confirm-modal',
      text: '해당 댓글을 삭제하시겠습니까?',
      buttons: [
              {
                label: '삭제',
                onClick: () => {
                  deleteExperienceGroupCommentMutate(commentId);
                },
              },
        {
          label: '취소',
        },
      ],
    });
  };

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isCommentCreating: isExperienceGroupCommentCreating,
    isCommentUpdating: isExperienceGroupCommentUpdating,
  };
}
