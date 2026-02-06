'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { useCommentFormState } from '@/features/comments/hooks/use-comment-form-state';
import { type CommentFormValues } from '@/features/comments/ui/comment-form';
import { PostDetailProvider, usePostDetail } from '@/features/posts/context/post-detail-context';
import PostDetailMoreButton from '@/features/posts/ui/post-detail/post-detail-more-button';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowGuide from '@/shared/hooks/use-show-guide';
import { CommentContainer } from '@/widgets/comments/ui/comment-container';
import CommentFormContainer from '@/widgets/comments/ui/comment-form-container';
import { SiteHeader } from '@/widgets/header';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';

type PostDetailPageContentProps = {
  postId: string;
  isFromMain: boolean;
};

function PostDetailPageContent({ postId, isFromMain }: PostDetailPageContentProps) {
  const { isUserDesigner, user } = useAuthContext();
  const { back } = useRouterWithUser();

  useShowGuide(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { postDetail } = usePostDetail();
  const isWriter = postDetail.hairConsultPostingCreateUserId === user.id;

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useCommentFormState({
      postId,
      receiverId: postDetail.hairConsultPostingCreateUserId.toString(),
    });

  const isFormPending = isCommentCreating || isCommentUpdating;

  const handleContainerClick = useCallback(() => {
    handlers.resetCommentState();
  }, [handlers]);

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      handlers.handleCommentFormSubmit(data, options);
    },
    [handlers],
  );

  const handleBackClick = useCallback(() => {
    if (isFromMain) {
      window.closeWebview('close');
    } else {
      back();
    }
  }, [isFromMain, back]);

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader
        title="헤어상담"
        showBackButton
        onBackClick={handleBackClick}
        rightComponent={
          isWriter && <PostDetailMoreButton postId={postId.toString()} isConsultingPost={true} />
        }
      />
      <div className="flex-1 overflow-y-auto" onClick={handleContainerClick}>
        <PostDetailContainer>
          <CommentContainer
            postId={postId.toString()}
            commentFormState={commentFormState}
            handlers={{
              ...handlers,
              handleCommentFormSubmit,
            }}
          />
        </PostDetailContainer>
      </div>
      <CommentFormContainer
        postId={postId.toString()}
        onSubmit={handleCommentFormSubmit}
        commentFormState={commentFormState}
        isPending={isFormPending}
        textareaRef={textareaRef}
        isConsulting={true}
        isAnsweredByDesigner={postDetail.isAnsweredByDesigner ?? false}
        postSource='legacy'
      />
    </div>
  );
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const searchParams = useSearchParams();

  const isFromMain = searchParams.get('isFromMain') === 'true';

  if (!postId) return null;

  return (
    <PostDetailProvider postId={postId.toString()}>
      <PostDetailPageContent postId={postId.toString()} isFromMain={isFromMain} />
    </PostDetailProvider>
  );
}
