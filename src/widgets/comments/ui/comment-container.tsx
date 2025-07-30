import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { useCallback } from 'react';
import useGetPostComments from '../../../features/comments/api/use-get-post-comments';
import { CommentList } from '../../../features/comments/ui/comment-list';

type CommentActionHandlers = {
  handleReplyClick: (commentId: number) => void;
  handleDeleteComment: (commentId: number) => void;
  handleEditComment: (commentId: number, comments: CommentWithReplyStatus[]) => void;
  handleCommentFormSubmit: (
    data: {
      content: string;
      isVisibleToModel: boolean;
      parentCommentId: string | null;
    },
    options: {
      onSuccess: () => void;
    },
  ) => void;
  resetCommentState: () => void;
};

type CommentContainerProps = {
  postId: string;
  commentFormState: CommentFormState;
  handlers: CommentActionHandlers;
};

export const CommentContainer = ({ postId, commentFormState, handlers }: CommentContainerProps) => {
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
  );
};
