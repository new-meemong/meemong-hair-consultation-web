import type { CommentActionHandlers } from '@/entities/comment/model/comment-action-handlers';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentList } from '@/features/comments/ui/comment-list';
import convertToCommentWithReplyStatusFromHairConsultationComment from '@/entities/comment/lib/convertToCommentWithReplyStatusFromHairConsultationComment';
import { useCallback } from 'react';
import useGetHairConsultationComments from '@/features/comments/api/use-get-hair-consultation-comments';
import { usePostDetail } from '@/features/posts/context/post-detail-context';

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

  const comments = convertToCommentWithReplyStatusFromHairConsultationComment(data);

  const { postDetail } = usePostDetail();

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <CommentList
      comments={comments}
      postId={postDetail.id.toString()}
      postWriterId={postDetail.hairConsultPostingCreateUserId}
      fetchNextPage={handleFetchNextPage}
      onReplyClick={handlers.handleReplyClick}
      focusedCommentId={commentFormState.commentId}
      onDelete={handlers.handleDeleteComment}
      onEdit={(commentId) => handlers.handleEditComment(commentId, comments)}
      onReport={() => {}}
      onTriggerClick={handlers.resetCommentState}
    />
  );
}
