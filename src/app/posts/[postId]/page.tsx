'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { useHairConsultationCommentFormState } from '@/features/comments/hooks/use-hair-consultation-comment-form-state';
import { type CommentFormValues } from '@/features/comments/ui/comment-form';
import { NewPostDetailProvider, usePostDetail } from '@/features/posts/context/post-detail-context';
import PostDetailMoreButton from '@/features/posts/ui/post-detail/post-detail-more-button';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowGuide from '@/shared/hooks/use-show-guide';
import HairConsultationCommentContainer from '@/widgets/comments/ui/hair-consultation-comment-container';
import CommentFormContainer from '@/widgets/comments/ui/comment-form-container';
import { SiteHeader } from '@/widgets/header';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';

type NewPostDetailPageContentProps = {
  postId: string;
  isFromMain: boolean;
};

function NewPostDetailPageContent({ postId, isFromMain }: NewPostDetailPageContentProps) {
  const { isUserDesigner, user } = useAuthContext();
  const { back } = useRouterWithUser();

  useShowGuide(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { postDetail } = usePostDetail();
  const isWriter = postDetail.hairConsultPostingCreateUserId === user.id;

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useHairConsultationCommentFormState({
      hairConsultationId: postId,
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
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen overflow-x-hidden">
      <SiteHeader
        title="헤어상담"
        showBackButton
        onBackClick={handleBackClick}
        rightComponent={isWriter && <PostDetailMoreButton postId={postId.toString()} />}
      />
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y"
        onClick={handleContainerClick}
      >
        <PostDetailContainer>
          <HairConsultationCommentContainer
            hairConsultationId={postId.toString()}
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
      />
    </div>
  );
}

export default function NewPostDetailPage() {
  const { postId } = useParams();
  const searchParams = useSearchParams();

  const isFromMain = searchParams.get('isFromMain') === 'true';

  if (!postId) return null;

  return (
    <NewPostDetailProvider postId={postId.toString()}>
      <NewPostDetailPageContent postId={postId.toString()} isFromMain={isFromMain} />
    </NewPostDetailProvider>
  );
}
