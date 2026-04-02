'use client';

import { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { type CommentFormValues } from '@/features/comments/ui/comment-form';
import { useHairConsultationCommentFormState } from '@/features/comments/hooks/use-hair-consultation-comment-form-state';
import { NewPostDetailProvider, usePostDetail } from '@/features/posts/context/post-detail-context';
import PostDetailMoreButton from '@/features/posts/ui/post-detail/post-detail-more-button';
import { getWebUserData } from '@/shared/lib/auth';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useBrand } from '@/shared/context/brand-context';
import HairConsultationCommentContainer from '@/widgets/comments/ui/hair-consultation-comment-container';
import CommentFormContainer from '@/widgets/comments/ui/comment-form-container';
import { SiteHeader } from '@/widgets/header';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';

function MyPostDetailPageContent({ postId }: { postId: string }) {
  const { back } = useRouterWithUser();
  const { postDetail } = usePostDetail();
  const { config: brand } = useBrand();
  const webUserId = getWebUserData(brand.slug)?.userId ?? null;
  const isWriter = webUserId != null && postDetail.hairConsultPostingCreateUserId === webUserId;

  useEffect(() => {
    if (webUserId != null && !isWriter) {
      back();
    }
  }, [webUserId, isWriter, back]);

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

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen overflow-x-hidden">
      <SiteHeader
        title="내 상담지"
        showBackButton
        onBackClick={back}
        rightComponent={isWriter && <PostDetailMoreButton postId={postId} />}
      />
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y"
        onClick={handleContainerClick}
      >
        <PostDetailContainer hideAuthorProfile>
          <HairConsultationCommentContainer
            hairConsultationId={postId}
            commentFormState={commentFormState}
            handlers={{
              ...handlers,
              handleCommentFormSubmit,
            }}
          />
        </PostDetailContainer>
      </div>
      <CommentFormContainer
        postId={postId}
        onSubmit={handleCommentFormSubmit}
        commentFormState={commentFormState}
        isPending={isFormPending}
        textareaRef={textareaRef}
        isConsulting={true}
        isAnsweredByDesigner={false}
      />
    </div>
  );
}

export default function MyPostDetailPage() {
  const { postId } = useParams();
  const { back } = useRouterWithUser();

  const handleNotFound = useCallback(() => {
    back();
  }, [back]);

  if (!postId || typeof postId !== 'string') return null;

  return (
    <NewPostDetailProvider postId={postId} onNotFound={handleNotFound}>
      <MyPostDetailPageContent postId={postId} />
    </NewPostDetailProvider>
  );
}
