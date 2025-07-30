import { useCallback } from 'react';
import { CommentList } from '../../../features/comments/ui/comment-list';
import { CommentForm } from '../../../features/comments/ui/comment-form';
import useGetPostComments from '../../../features/comments/api/use-get-post-comments';
import { useCommentFormState } from '../../../features/comments/hooks/use-comment-form-state';
import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';

export const CommentContainer = ({ postId }: { postId: string }) => {
  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useCommentFormState(postId);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetPostComments(postId);

  const comments: CommentWithReplyStatus[] =
    data?.pages.flatMap((page) =>
      page.data.comments.flatMap((comment) => [
        { ...comment, isReply: false },
        ...(comment.replies ?? []).map((reply) => ({ ...reply, isReply: true })),
      ]),
    ) ?? [];

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <CommentList
        comments={comments}
        fetchNextPage={handleFetchNextPage}
        onReplyClick={handlers.handleReplyClick}
        focusedCommentId={commentFormState.commentId}
        onDelete={handlers.handleDeleteComment}
        onEdit={(commentId) => handlers.handleEditComment(commentId, comments)}
        onReport={() => {}}
        onTriggerClick={handlers.resetCommentState}
      />
      <div className="sticky bottom-0 bg-white shadow-strong">
        <div className="max-w-[600px] mx-auto">
          <CommentForm
            onSubmit={handlers.handleCommentFormSubmit}
            isReply={commentFormState.state === 'reply'}
            commentId={commentFormState.commentId}
            content={commentFormState.content}
            isPending={isCommentCreating || isCommentUpdating}
            textareaRef={textareaRef}
          />
        </div>
      </div>
    </>
  );
};
