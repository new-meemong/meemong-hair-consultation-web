'use client';

import { useCallback } from 'react';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { CommentContainer } from '@/widgets/comments/ui/comment-container';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';
import PostDetailMoreButton from '@/features/posts/ui/post-detail-more-button';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';
import { useCommentFormState } from '@/features/comments/hooks/use-comment-form-state';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';

export default function PostDetailPage() {
  const { isUserDesigner, user } = useAuthContext();
  const { id: postId } = useParams();

  useGuidePopup(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const isWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useCommentFormState(postId?.toString() ?? '');

  const handleContainerClick = useCallback(() => {
    handlers.resetCommentState();
  }, [handlers]);

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      handlers.handleCommentFormSubmit(data, options);
    },
    [handlers],
  );

  if (!postId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader
        title="헤어상담"
        showBackButton
        rightComponent={isWriter && <PostDetailMoreButton postId={postId.toString()} />}
      />
      <div className="flex-1 overflow-y-auto" onClick={handleContainerClick}>
        {postDetail && (
          <PostDetailContainer postDetail={postDetail}>
            <CommentContainer
              postId={postId.toString()}
              commentFormState={commentFormState}
              handlers={{
                ...handlers,
                handleCommentFormSubmit,
              }}
            />
          </PostDetailContainer>
        )}
      </div>
      <div className="f bg-white shadow-strong">
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
    </div>
  );
}
