import useCreateCommentMutation from '../api/use-create-comment-mutation';
import usePatchPostCommentMutation from '../api/use-patch-post-comment-mutation';
import useDeletePostCommentMutation from '../api/use-delete-post-comment-mutation';
import type { CommentFormValues } from '../ui/comment-form';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

export default function useCommentOperations(postId: string, commentId?: number | null) {
  const { mutate: createCommentMutate, isPending: isCommentCreating } =
    useCreateCommentMutation(postId);
  const { mutate: updateCommentMutate, isPending: isCommentUpdating } = usePatchPostCommentMutation(
    {
      postId,
      commentId: commentId?.toString() ?? '',
    },
  );
  const { mutate: deleteCommentMutate } = useDeletePostCommentMutation(postId);
  const showModal = useShowModal();

  const handleCreate = (data: CommentFormValues, onSuccess: () => void) => {
    createCommentMutate(data, { onSuccess });
  };

  const handleUpdate = (content: string, onSuccess: () => void) => {
    updateCommentMutate({ content }, { onSuccess });
  };

  const handleDelete = (commentId: number) => {
    showModal({
      id: 'delete-comment-confirm-modal',
      text: '해당 댓글을 삭제하시겠습니까?',
      buttons: [
        {
          label: '삭제',
          onClick: () => {
            deleteCommentMutate(commentId);
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
