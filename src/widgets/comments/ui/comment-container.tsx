import { useCallback } from 'react';

import convertToCommentWithReplyStatusFromPostComment from '@/entities/comment/lib/convertToCommentWithReplyStatus';
import type { CommentActionHandlers } from '@/entities/comment/model/comment-action-handlers';
import useGetPostComments from '@/features/comments/api/use-get-post-comments';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentList } from '@/features/comments/ui/comment-list';
import { usePostDetail } from '@/features/posts/context/post-detail-context';

type CommentContainerProps = {
  postId: string;
  commentFormState: CommentFormState;
  handlers: CommentActionHandlers;
};

export const CommentContainer = ({ postId, commentFormState, handlers }: CommentContainerProps) => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetPostComments(postId);

  const comments = convertToCommentWithReplyStatusFromPostComment(data);

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
};
