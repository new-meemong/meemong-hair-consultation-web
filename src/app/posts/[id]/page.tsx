'use client';

import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useCreateCommentMutation from '@/features/comments/api/use-create-comment-mutation';
import useGetPostComments from '@/features/comments/api/use-get-post-comments';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import useDeletePostMutation from '@/features/posts/api/use-delete-post-mutation';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import PostDetailItem from '@/features/posts/ui/post-detail-item';
import { MoreOptionsMenu, ROUTES } from '@/shared';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import { CommentList } from '@/widgets/comments';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';

type CommentFormState = {
  state: 'create' | 'edit' | 'reply';
  commentId: number | null;
  content: string | null;
};

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

  const { mutate: createCommentMutate } = useCreateCommentMutation(postId?.toString() ?? '');

  const { push } = useRouterWithUser();

  const handleEdit = () => {
    if (!postId) return;

    push(ROUTES.POSTS_EDIT(postId.toString()));
  };

  const showModal = useShowModal();

  const { mutate: deletePost } = useDeletePostMutation();

  const handleDelete = () => {
    const handleDeletePost = () => {
      if (!postId) return;

      deletePost(Number(postId), {
        onSuccess: () => {
          showModal({
            id: 'delete-post-confirm-modal',
            text: '삭제가 완료되었습니다.',
            buttons: [
              {
                label: '확인',
                onClick: () => {
                  push(ROUTES.POSTS);
                },
              },
            ],
          });
        },
      });
    };

    showModal({
      id: 'delete-post-confirm-modal',
      text: '해당 게시글을 삭제하시겠습니까?',
      buttons: [
        {
          label: '삭제',
          onClick: handleDeletePost,
        },
        {
          label: '취소',
        },
      ],
    });
  };

  const getMoreOptions = () => [
    {
      label: '수정하기',
      onClick: handleEdit,
    },
    {
      label: '삭제하기',
      onClick: handleDelete,
      className: 'text-negative',
    },
  ];

  const isDataLoaded = postDetail && comments;

  const [commentFormState, setCommentFormState] = useState<CommentFormState>(
    INITIAL_COMMENT_FORM_STATE,
  );

  const resetCommentState = () => {
    setCommentFormState(INITIAL_COMMENT_FORM_STATE);
  };

  const handleReplyClick = (commentId: number) => {
    if (commentFormState.commentId === commentId) {
      resetCommentState();
    } else {
      setCommentFormState({
        state: 'reply',
        commentId,
        content: null,
      });
      // TODO: 대댓글 포커싱 추가
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
    if (commentFormState.state === 'create' || commentFormState.state === 'reply') {
      createCommentMutate(data, {
        onSuccess: () => {
          options.onSuccess();
          resetCommentState();
        },
      });
    } else if (commentFormState.state === 'edit') {
      // updateCommentMutate(data);
    }
  };

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <div className="flex-1 overflow-hidden flex flex-col" onClick={resetCommentState}>
        <SiteHeader
          title="헤어상담"
          showBackButton
          rightComponent={
            isWriter && (
              <MoreOptionsMenu
                trigger={<MoreIcon className="size-7" />}
                options={getMoreOptions()}
                contentClassName="-right-[14px] "
              />
            )
          }
        />
        {isDataLoaded && (
          <div className="flex-1 overflow-y-auto">
            <PostDetailItem postDetail={postDetail} />
            <CommentList
              comments={comments}
              fetchNextPage={handleFetchNextPage}
              onReplyClick={handleReplyClick}
              focusedCommentId={commentFormState.commentId}
              onDelete={() => {}}
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
          />
        </div>
      </div>
    </div>
  );
}
