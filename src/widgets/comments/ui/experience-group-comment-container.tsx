import { useCallback } from 'react';

import convertToCommentWithReplyStatusFromExperienceGroup from '@/entities/comment/lib/convertToCommentWithReplyStatusFromExperienceGroup';
import type { CommentActionHandlers } from '@/entities/comment/model/comment-action-handlers';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useGetExperienceGroupComments from '@/features/comments/api/use-get-experience-group-comments';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentList } from '@/features/comments/ui/comment-list';

type ExperienceGroupCommentContainerProps = {
  experienceGroupId: string;
  postWriterId: number;
  commentFormState: CommentFormState;
  handlers: CommentActionHandlers;
};

export default function ExperienceGroupCommentContainer({
  experienceGroupId,
  postWriterId,
  commentFormState,
  handlers,
}: ExperienceGroupCommentContainerProps) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetExperienceGroupComments({
    experienceGroupId,
  });

  const { isUserDesigner } = useAuthContext();

  const comments = convertToCommentWithReplyStatusFromExperienceGroup(data, isUserDesigner);

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <CommentList
      comments={comments}
      postId={experienceGroupId}
      postWriterId={postWriterId}
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
