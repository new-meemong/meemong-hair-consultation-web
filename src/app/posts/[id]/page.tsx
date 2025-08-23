'use client';

import { useCallback } from 'react';

import { useParams } from 'next/navigation';

import { isConsultingPost } from '@/entities/posts/lib/consulting-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useCommentFormState } from '@/features/comments/hooks/use-comment-form-state';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { PostDetailProvider } from '@/features/posts/context/post-detail-context';
import useWritingConsultingResponse from '@/features/posts/hooks/use-writing-consulting-response';
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

  const handleWriteConsultingResponseClick = () => {
    if (!postId) return;

    push(ROUTES.POSTS_CREATE_CONSULTING_POST(postId.toString()));
  };

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useCommentFormState(postId?.toString() ?? '');

  const isCommentFormReply = commentFormState.state === 'reply';

  const canWriteConsultingResponse =
    postDetail && isConsultingPost(postDetail) && isUserDesigner && !isCommentFormReply;

  const handleContainerClick = useCallback(() => {
    handlers.resetCommentState();
  }, [handlers]);

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      handlers.handleCommentFormSubmit(data, options);
    },
    [handlers],
  );

  const { hasSavedContent } = useWritingConsultingResponse(postId?.toString() ?? '');

  const writingResponseButtonText = hasSavedContent ? '이어서 작성하기' : '컨설팅 답글 작성하기';

  if (!postId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <PostDetailProvider postId={postId.toString()}>
        <SiteHeader
          title="헤어상담"
          showBackButton
          rightComponent={isWriter && <PostDetailMoreButton postId={postId.toString()} />}
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

        {canWriteConsultingResponse ? (
          <div className="bg-white shadow-upper px-5 py-3">
            <Button size="lg" className="w-full" onClick={handleWriteConsultingResponseClick}>
              {writingResponseButtonText}
            </Button>
          </div>
        ) : (
          <div className="bg-white shadow-strong">
            <div className="max-w-[600px] mx-auto">
              <CommentForm
                onSubmit={handlers.handleCommentFormSubmit}
                isReply={isCommentFormReply}
                commentId={commentFormState.commentId}
                content={commentFormState.content}
                isPending={isCommentCreating || isCommentUpdating}
                textareaRef={textareaRef}
              />
            </div>
          </div>
        )}
      </PostDetailProvider>
    </div>
  );
}
