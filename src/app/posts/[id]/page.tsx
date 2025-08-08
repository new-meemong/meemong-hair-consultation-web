'use client';

import { useCallback } from 'react';

import { useParams } from 'next/navigation';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { useCommentFormState } from '@/features/comments/hooks/use-comment-form-state';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import PostDetailMoreButton from '@/features/posts/ui/post-detail/post-detail-more-button';
import { Button } from '@/shared';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ROUTES } from '@/shared/lib/routes';
import { CommentContainer } from '@/widgets/comments/ui/comment-container';
import { SiteHeader } from '@/widgets/header';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';

export default function PostDetailPage() {
  const { isUserDesigner, user } = useAuthContext();
  const { id: postId } = useParams();
  const { push } = useRouterWithUser();

  useGuidePopup(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const isWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  // TODO: 추후 컨설팅 게시글 여부 확인 로직 추가
  const isConsultingPost = false;
  const canWriteConsultingResponse = isConsultingPost && isUserDesigner;

  const handleWriteConsultingResponseClick = () => {
    if (!postId) return;

    push(ROUTES.POSTS_CREATE_CONSULTING_POST(postId.toString()));
  };

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

      {canWriteConsultingResponse ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-upper px-5 py-3">
          {/* TODO: 이어서 작성하기 기능 추가 */}
          <Button size="lg" className="w-full" onClick={handleWriteConsultingResponseClick}>
            컨설팅 답글 보내기
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow-strong">
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
      )}
    </div>
  );
}
