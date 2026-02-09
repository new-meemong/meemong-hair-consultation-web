import type { CommentActionHandlers } from '@/entities/comment/model/comment-action-handlers';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentList } from '@/features/comments/ui/comment-list';
import convertToCommentWithReplyStatusFromHairConsultationAnswer from '@/entities/comment/lib/convertToCommentWithReplyStatusFromHairConsultationAnswer';
import convertToCommentWithReplyStatusFromHairConsultationComment from '@/entities/comment/lib/convertToCommentWithReplyStatusFromHairConsultationComment';
import { useCallback, useMemo } from 'react';
import useGetHairConsultationComments from '@/features/comments/api/use-get-hair-consultation-comments';
import useGetHairConsultationAnswers from '@/features/posts/api/use-get-hair-consultation-answers';
import useDeleteHairConsultationAnswerMutation from '@/features/posts/api/use-delete-hair-consultation-answer-mutation';
import { usePostDetail } from '@/features/posts/context/post-detail-context';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

type HairConsultationCommentContainerProps = {
  hairConsultationId: string;
  commentFormState: CommentFormState;
  handlers: CommentActionHandlers;
};

export default function HairConsultationCommentContainer({
  hairConsultationId,
  commentFormState,
  handlers,
}: HairConsultationCommentContainerProps) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetHairConsultationComments(hairConsultationId);
  const { data: answersData } = useGetHairConsultationAnswers(hairConsultationId, {
    __limit: 100,
  });

  const comments = convertToCommentWithReplyStatusFromHairConsultationComment(data);
  const answers = convertToCommentWithReplyStatusFromHairConsultationAnswer(answersData);
  const mergedComments = useMemo(
    () =>
      [...comments, ...answers].sort((a, b) => {
        const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (!Number.isNaN(timeDiff) && timeDiff !== 0) return timeDiff;
        return b.id - a.id;
      }),
    [comments, answers],
  );

  const { postDetail } = usePostDetail();
  const { mutate: deleteHairConsultationAnswerMutate } = useDeleteHairConsultationAnswerMutation();
  const showModal = useShowModal();

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = useCallback(
    (commentId: number) => {
      const targetComment = mergedComments.find((comment) => comment.id === commentId);

      if (targetComment?.isConsultingAnswer && targetComment.answerId) {
        showModal({
          id: 'delete-answer-confirm-modal',
          text: '해당 답변을 삭제하시겠습니까?',
          buttons: [
            {
              label: '삭제',
              onClick: () => {
                deleteHairConsultationAnswerMutate(
                  {
                    hairConsultationId,
                    hairConsultationsAnswerId: targetComment.answerId as number,
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
        return;
      }

      handlers.handleDeleteComment(commentId);
    },
    [
      mergedComments,
      showModal,
      deleteHairConsultationAnswerMutate,
      hairConsultationId,
      handlers,
    ],
  );

  return (
    <CommentList
      comments={mergedComments}
      postId={postDetail.id.toString()}
      postWriterId={postDetail.hairConsultPostingCreateUserId}
      fetchNextPage={handleFetchNextPage}
      onReplyClick={handlers.handleReplyClick}
      focusedCommentId={commentFormState.commentId}
      onDelete={handleDelete}
      onEdit={(commentId) => handlers.handleEditComment(commentId, mergedComments)}
      onReport={() => {}}
      onTriggerClick={handlers.resetCommentState}
    />
  );
}
