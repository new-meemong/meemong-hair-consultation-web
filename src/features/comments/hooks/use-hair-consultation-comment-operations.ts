import type { CommentFormValues } from '../ui/comment-form';
import useCreateHairConsultationCommentMutation from '../api/use-create-hair-consultation-comment-mutation';
import useDeleteHairConsultationCommentMutation from '../api/use-delete-hair-consultation-comment-mutation';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import useUpdateHairConsultationCommentMutation from '../api/use-update-hair-consultation-comment-mutation';

type UseHairConsultationCommentOperationsProps = {
  hairConsultationId: string;
  commentId?: number | null;
};

export default function useHairConsultationCommentOperations({
  hairConsultationId,
  commentId,
}: UseHairConsultationCommentOperationsProps) {
  const { mutate: createHairConsultationCommentMutate, isPending: isCommentCreating } =
    useCreateHairConsultationCommentMutation(hairConsultationId);
  const { mutate: updateHairConsultationCommentMutate, isPending: isCommentUpdating } =
    useUpdateHairConsultationCommentMutation();
  const { mutate: deleteHairConsultationCommentMutate } =
    useDeleteHairConsultationCommentMutation();

  const showModal = useShowModal();

  const handleCreate = (data: CommentFormValues, onSuccess: () => void) => {
    createHairConsultationCommentMutate(
      {
        content: data.content,
        parentCommentId: data.parentCommentId ? Number(data.parentCommentId) : undefined,
      },
      { onSuccess },
    );
  };

  const handleUpdate = (content: string, onSuccess: () => void) => {
    if (!commentId) return;
    updateHairConsultationCommentMutate(
      {
        hairConsultationId,
        hairConsultationCommentId: commentId,
        data: { content },
      },
      { onSuccess },
    );
  };

  const handleDelete = (targetCommentId: number) => {
    showModal({
      id: 'delete-comment-confirm-modal',
      text: '해당 댓글을 삭제하시겠습니까?',
      buttons: [
        {
          label: '삭제',
          onClick: () => {
            deleteHairConsultationCommentMutate(
              {
                hairConsultationId,
                hairConsultationCommentId: targetCommentId,
              },
              { onSuccess: () => {} },
            );
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
    isCommentCreating,
    isCommentUpdating,
  };
}
