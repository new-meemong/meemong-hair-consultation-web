'use client';

import { NewPostDetailProvider, usePostDetail } from '@/features/posts/context/post-detail-context';
import { useCallback, useEffect } from 'react';

import HairConsultationCommentContainer from '@/widgets/comments/ui/hair-consultation-comment-container';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';
import PostDetailMoreButton from '@/features/posts/ui/post-detail/post-detail-more-button';
import { ROUTES } from '@/shared/lib/routes';
import { SiteHeader } from '@/widgets/header';
import { getWebUserData } from '@/shared/lib/auth';
import { useBrand } from '@/shared/context/brand-context';
import { useHairConsultationCommentFormState } from '@/features/comments/hooks/use-hair-consultation-comment-form-state';
import { useParams } from 'next/navigation';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

function MyPostDetailPageContent({ postId }: { postId: string }) {
  const { back, replace } = useRouterWithUser();
  const { postDetail } = usePostDetail();
  const { config: brand } = useBrand();
  const webUserId = getWebUserData(brand.slug)?.userId ?? null;
  const isWriter = webUserId != null && postDetail.hairConsultPostingCreateUserId === webUserId;

  useEffect(() => {
    if (webUserId != null && !isWriter) {
      replace(ROUTES.WEB_MY(brand.slug));
    }
  }, [webUserId, isWriter, replace, brand.slug]);

  const { commentFormState, handlers } = useHairConsultationCommentFormState({
    hairConsultationId: postId,
    receiverId: postDetail.hairConsultPostingCreateUserId.toString(),
  });

  const handleContainerClick = useCallback(() => {
    handlers.resetCommentState();
  }, [handlers]);

  if (webUserId != null && !isWriter) {
    return null;
  }

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen overflow-x-hidden">
      <SiteHeader
        title="헤어컨설팅"
        showBackButton
        onBackClick={back}
        rightComponent={isWriter && <PostDetailMoreButton postId={postId} />}
      />
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y"
        onClick={handleContainerClick}
      >
        <PostDetailContainer
          topContent={
            <div className="px-5 pt-6">
              <p className="typo-body-3-regular text-label-info">{brand.name} 컨설팅</p>
            </div>
          }
          hideAuthorProfile
          isWriter={isWriter}
          compactTitleSpacing
          hideTopAdvisor
        >
          <HairConsultationCommentContainer
            hairConsultationId={postId}
            commentFormState={commentFormState}
            handlers={handlers}
          />
        </PostDetailContainer>
      </div>
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
