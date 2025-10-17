'use client';

import { useCallback, useState } from 'react';

import { useParams } from 'next/navigation';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
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
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowGuide from '@/shared/hooks/use-show-guide';
import { ROUTES } from '@/shared/lib/routes';
import { CommentContainer } from '@/widgets/comments/ui/comment-container';
import { SiteHeader } from '@/widgets/header';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';

export default function PostDetailPage() {
  const { isUserDesigner, user } = useAuthContext();
  const { postId } = useParams();
  const { push } = useRouterWithUser();

  useShowGuide(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const isWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  const handleWriteConsultingResponseClick = () => {
    if (!postId) return;

    push(ROUTES.POSTS_CREATE_CONSULTING_POST(postId.toString()));
  };

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useCommentFormState({
      postId: postId?.toString() ?? '',
      receiverId: postDetail?.hairConsultPostingCreateUserId.toString() ?? '',
    });

  const isCommentFormReply = commentFormState.state === 'reply';

  const isConsulting = postDetail ? isConsultingPost(postDetail) : false;

  const canWriteConsultingResponse =
    postDetail &&
    isConsulting &&
    isUserDesigner &&
    !isCommentFormReply &&
    !postDetail.isAnsweredByDesigner;

  const [commentMode, setCommentMode] = useState<'consulting' | 'normal'>(
    canWriteConsultingResponse ? 'consulting' : 'normal',
  );

  const handleNormalCommentClick = useCallback(() => {
    setCommentMode('normal');
  }, []);

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

  const writingResponseButtonText = hasSavedContent ? '이어서 작성하기' : '컨설팅 답변하기';

  if (!postId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <PostDetailProvider postId={postId.toString()}>
        <SiteHeader
          title="헤어상담"
          showBackButton
          rightComponent={
            isWriter && (
              <PostDetailMoreButton postId={postId.toString()} isConsultingPost={isConsulting} />
            )
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

        <div className="relative">
          {canWriteConsultingResponse && commentMode === 'normal' && (
            <Button
              className="absolute -top-14 left-1/2 transform -translate-x-1/2 rounded-4 bg-label-default py-[9.5px] px-3 shadow-strong typo-body-2-medium"
              onClick={handleWriteConsultingResponseClick}
            >
              <div className="flex items-center gap-1 text-white">
                컨설팅 답변 작성
                <ChevronRightIcon className="size-4 fill-white" />
              </div>
            </Button>
          )}
          {canWriteConsultingResponse && commentMode === 'consulting' ? (
            <div className="bg-white shadow-upper px-5 py-3 flex gap-3 justify-evenly">
              <Button size="md" theme="white" className="flex-1" onClick={handleNormalCommentClick}>
                일반 댓글 달기
              </Button>
              <Button size="md" className="flex-1" onClick={handleWriteConsultingResponseClick}>
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
        </div>
      </PostDetailProvider>
    </div>
  );
}
