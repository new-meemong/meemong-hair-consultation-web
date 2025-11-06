import useShowModal from '@/shared/ui/hooks/use-show-modal';

import useCreateExperienceGroupCommentMutation from '../api/use-create-experience-group-comment-mutation';
import useCreatePostCommentMutation from '../api/use-create-post-comment-mutation';
import useDeleteExperienceGroupCommentMutation from '../api/use-delete-experience-group-comment-mutation';
import useDeletePostCommentMutation from '../api/use-delete-post-comment-mutation';
import usePatchExperienceGroupCommentMutation from '../api/use-patch-experience-group-comment-mutation';
import usePatchPostCommentMutation from '../api/use-patch-post-comment-mutation';
import type { CommentFormValues } from '../ui/comment-form';

type UseCommentOperationsProps = {
  postId?: string;
  experienceGroupId?: string;
  commentId?: number | null;
};

export default function useCommentOperations({
  postId,
  commentId,
  experienceGroupId,
}: UseCommentOperationsProps) {
  const { mutate: createPostCommentMutate, isPending: isPostCommentCreating } =
    useCreatePostCommentMutation(postId ?? '');
  const { mutate: updatePostCommentMutate, isPending: isPostCommentUpdating } =
    usePatchPostCommentMutation({
      postId: postId ?? '',
      commentId: commentId?.toString() ?? '',
    });
  const { mutate: deletePostCommentMutate } = useDeletePostCommentMutation(postId ?? '');

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

  const updateCommentMutate = postId ? updatePostCommentMutate : updateExperienceGroupCommentMutate;
  const deleteCommentMutate = postId ? deletePostCommentMutate : deleteExperienceGroupCommentMutate;

  const showModal = useShowModal();

  const handleCreate = (data: CommentFormValues, onSuccess: () => void) => {
    if (postId) {
      createPostCommentMutate(data, { onSuccess });
    } else if (experienceGroupId) {
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
    isCommentCreating: postId ? isPostCommentCreating : isExperienceGroupCommentCreating,
    isCommentUpdating: postId ? isPostCommentUpdating : isExperienceGroupCommentUpdating,
  };
}
