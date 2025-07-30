import { useCallback } from 'react';
import { CommentList } from '../../../features/comments/ui/comment-list';
import { CommentForm } from '../../../features/comments/ui/comment-form';
import useGetPostComments from '../../../features/comments/api/use-get-post-comments';
import { useCommentFormState } from '../../../features/comments/hooks/use-comment-form-state';
import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import { useAuthContext } from '@/features/auth/context/auth-context';

export const CommentContainer = ({ postId }: { postId: string }) => {
  const { isUserDesigner } = useAuthContext();
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

  const formHeight = isUserDesigner ? 64 + 48 : 64;
  const bottomPadding = `pb-[${formHeight}px]`;

  return (
    <>
      <div className={bottomPadding}>
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
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-strong">
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
