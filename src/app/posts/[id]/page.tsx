'use client';

import { useAuthContext } from '@/features/auth/context/auth-context';
import useCreateCommentMutation from '@/features/comments/api/use-create-comment-mutation';
import useDeletePostCommentMutation from '@/features/comments/api/use-delete-post-comment-mutation';
import useGetPostComments from '@/features/comments/api/use-get-post-comments';
import usePatchPostCommentMutation from '@/features/comments/api/use-patch-post-comment-mutation';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import PostDetailItem from '@/features/posts/ui/post-detail-item';
import PostDetailMoreButton from '@/features/posts/ui/post-detail-more-button';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import { CommentList } from '@/widgets/comments';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

const INITIAL_COMMENT_FORM_STATE: CommentFormState = {
  state: 'create',
  commentId: null,
  content: null,
} as const;

export default function PostDetailPage() {
  const { isUserDesigner, user } = useAuthContext();

  useGuidePopup(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { id: postId } = useParams();

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetPostComments(
    postId?.toString() ?? '',
  );

  const comments = data?.pages.flatMap((page) =>
    page.data.comments.flatMap((comment) => [
      { ...comment, isReply: false },
      ...(comment.replies ?? []).map((reply) => ({ ...reply, isReply: true })),
    ]),
  );

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  const [commentFormState, setCommentFormState] = useState<CommentFormState>(
    INITIAL_COMMENT_FORM_STATE,
  );

  const { mutate: createCommentMutate, isPending: isCommentCreating } = useCreateCommentMutation(
    postId?.toString() ?? '',
  );
  const { mutate: updateCommentMutate, isPending: isCommentUpdating } = usePatchPostCommentMutation(
    {
      postId: postId?.toString() ?? '',
      commentId: commentFormState.commentId?.toString() ?? '',
    },
  );

  const showModal = useShowModal();

  const isDataLoaded = postDetail && comments;

  const resetCommentState = () => {
    setCommentFormState(INITIAL_COMMENT_FORM_STATE);
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleReplyClick = (commentId: number) => {
    if (commentFormState.commentId === commentId) {
      resetCommentState();
    } else {
      setCommentFormState({
        state: 'reply',
        commentId,
        content: null,
      });
      textareaRef.current?.focus();
    }
  };

  const handleEditComment = (commentId: number) => {
    const comment = comments?.find((comment) => comment.id === commentId);
    if (!comment) return;

    setCommentFormState({
      state: 'edit',
      commentId,
      content: comment.content,
    });
  };

  const handleCommentFormSubmit = (data: CommentFormValues, options: { onSuccess: () => void }) => {
    const onSuccess = () => {
      options.onSuccess();
      resetCommentState();
    };

    if (commentFormState.state === 'create' || commentFormState.state === 'reply') {
      createCommentMutate(data, {
        onSuccess,
      });
    } else if (commentFormState.state === 'edit') {
      updateCommentMutate(
        { content: data.content },
        {
          onSuccess,
        },
      );
    }
  };

  const { mutate: deleteCommentMutate } = useDeletePostCommentMutation(postId?.toString() ?? '');

  const handleDeleteComment = (commentId: number) => {
    showModal({
      id: 'delete-comment-confirm-modal',
      text: '해당 댓글을 삭제하시겠습니까?',
      buttons: [
        {
          label: '삭제',
          onClick: () => {
            deleteCommentMutate(commentId);
          },
        },
        {
          label: '취소',
        },
      ],
    });
  };

  if (!postId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <div className="flex-1 overflow-hidden flex flex-col" onClick={resetCommentState}>
        <SiteHeader
          title="헤어상담"
          showBackButton
          rightComponent={isWriter && <PostDetailMoreButton postId={postId.toString()} />}
        />
        {isDataLoaded && (
          <div className="flex-1 overflow-y-auto">
            <PostDetailItem postDetail={postDetail} />
            <CommentList
              comments={comments}
              fetchNextPage={handleFetchNextPage}
              onReplyClick={handleReplyClick}
              focusedCommentId={commentFormState.commentId}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              onReport={() => {}}
              onTriggerClick={resetCommentState}
            />
          </div>
        )}
      </div>

      {/* 댓글 입력 필드 */}
      <div className="bg-white shadow-strong">
        <div className="max-w-[600px] mx-auto">
          <CommentForm
            onSubmit={handleCommentFormSubmit}
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
