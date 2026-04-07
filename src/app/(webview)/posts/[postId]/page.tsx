'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import useMeemongPassPolicy from '@/features/ad-block/hook/use-meemong-pass-policy';
import { useHairConsultationCommentFormState } from '@/features/comments/hooks/use-hair-consultation-comment-form-state';
import useGetHairConsultationAnswers from '@/features/posts/api/use-get-hair-consultation-answers';
import useHairConsultationBrandAccess from '@/features/posts/hooks/use-hair-consultation-brand-access';
import useShowBrandStaffOnlyPostSheet from '@/features/posts/hooks/use-show-brand-staff-only-post-sheet';
import { type CommentFormValues } from '@/features/comments/ui/comment-form';
import { NewPostDetailProvider, usePostDetail } from '@/features/posts/context/post-detail-context';
import PostDetailMoreButton from '@/features/posts/ui/post-detail/post-detail-more-button';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { closeAppWebView, normalizeSource } from '@/shared/lib/app-bridge';
import useShowGuide from '@/shared/hooks/use-show-guide';
import HairConsultationCommentContainer from '@/widgets/comments/ui/hair-consultation-comment-container';
import CommentFormContainer from '@/widgets/comments/ui/comment-form-container';
import { SiteHeader } from '@/widgets/header';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';

type NewPostDetailPageContentProps = {
  postId: string;
  shouldCloseWebViewOnBack: boolean;
};

function NewPostDetailPageContent({
  postId,
  shouldCloseWebViewOnBack,
}: NewPostDetailPageContentProps) {
  const auth = useOptionalAuthContext();
  const isUserDesigner = auth?.isUserDesigner ?? false;
  const user = auth?.user ?? null;
  useMeemongPassPolicy(); // prefetch ad-block status so canSkipMong is ready before user clicks an answer
  const { back } = useRouterWithUser();

  useShowGuide(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { postDetail } = usePostDetail();
  const { isDesignerBlockedFromBrandPost, postBrandName } = useHairConsultationBrandAccess(postId);
  const showBrandStaffOnlyPostSheet = useShowBrandStaffOnlyPostSheet();
  const isWriter = user != null && postDetail.hairConsultPostingCreateUserId === user.id;
  const { data: answersData } = useGetHairConsultationAnswers(postId, {
    __limit: 100,
  });
  const hasAnsweredCurrentDesigner =
    isUserDesigner &&
    (answersData?.pages ?? []).some((page) =>
      page.dataList.some((answer) => user != null && answer.user.id === user.id),
    );

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useHairConsultationCommentFormState({
      hairConsultationId: postId,
      receiverId: postDetail.hairConsultPostingCreateUserId.toString(),
    });

  const isFormPending = isCommentCreating || isCommentUpdating;

  const handleRestrictedBrandAttempt = useCallback(() => {
    showBrandStaffOnlyPostSheet(postBrandName);
  }, [postBrandName, showBrandStaffOnlyPostSheet]);

  const handleContainerClick = useCallback(() => {
    handlers.resetCommentState();
  }, [handlers]);

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      if (isDesignerBlockedFromBrandPost) {
        handleRestrictedBrandAttempt();
        return;
      }

      handlers.handleCommentFormSubmit(data, options);
    },
    [handleRestrictedBrandAttempt, handlers, isDesignerBlockedFromBrandPost],
  );

  const handleReplyClick = useCallback(
    (commentId: number) => {
      if (isDesignerBlockedFromBrandPost) {
        handleRestrictedBrandAttempt();
        return;
      }

      handlers.handleReplyClick(commentId);
    },
    [handleRestrictedBrandAttempt, handlers, isDesignerBlockedFromBrandPost],
  );

  const handleBackClick = useCallback(() => {
    if (shouldCloseWebViewOnBack) {
      const closed = closeAppWebView('close');
      if (closed) {
        return;
      }
    }
    back();
  }, [shouldCloseWebViewOnBack, back]);

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
            onReplyClick={handleReplyClick}
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
        isAnsweredByDesigner={hasAnsweredCurrentDesigner}
        onRestrictedBrandAttempt={
          isDesignerBlockedFromBrandPost ? handleRestrictedBrandAttempt : undefined
        }
      />
    </div>
  );
}

export default function NewPostDetailPage() {
  const { postId } = useParams();
  const searchParams = useSearchParams();
  const { back } = useRouterWithUser();

  const source = normalizeSource(searchParams.get(SEARCH_PARAMS.SOURCE));
  const isFromMain = searchParams.get('isFromMain') === 'true';
  const shouldCloseWebViewOnBack = source === 'app' || isFromMain;

  const handleNotFound = useCallback(() => {
    const closed = shouldCloseWebViewOnBack && closeAppWebView('close');
    if (!closed) {
      back();
    }
  }, [shouldCloseWebViewOnBack, back]);

  if (!postId) return null;

  return (
    <NewPostDetailProvider postId={postId.toString()} onNotFound={handleNotFound}>
      <NewPostDetailPageContent
        postId={postId.toString()}
        shouldCloseWebViewOnBack={shouldCloseWebViewOnBack}
      />
    </NewPostDetailProvider>
  );
}
