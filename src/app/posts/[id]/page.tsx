'use client';

import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useCreateCommentMutation from '@/features/comments/api/use-create-comment-mutation';
import useGetPostComments from '@/features/comments/api/use-get-post-comments';
import { CommentForm } from '@/features/comments/ui/comment-form';
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
import { useCallback } from 'react';

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

  console.log(handleFetchNextPage);

  console.log('comments', comments);

  const isWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  const { mutate: createCommentMutate } = useCreateCommentMutation(postId?.toString() ?? '');

  // const handleEditComment = async (commentId: string, newContent: string) => {
  //   try {
  //     const updatedComment = await updateComment({ commentId, content: newContent });

  //     setComments((prev) => {
  //       return prev.map((comment) => {
  //         if (comment.id === commentId) {
  //           return { ...comment, content: updatedComment.content };
  //         }

  //         if (comment.replies.some((reply) => reply.id === commentId)) {
  //           return {
  //             ...comment,
  //             replies: comment.replies.map((reply) =>
  //               reply.id === commentId ? { ...reply, content: updatedComment.content } : reply,
  //             ),
  //           };
  //         }

  //         return comment;
  //       });
  //     });
  //   } catch (error) {
  //     console.error('댓글 수정 실패:', error);
  //   }
  // };

  // const handleDeleteComment = async (commentId: string) => {
  //   try {
  //     const result = await deleteComment(commentId);

  //     if (result.success) {
  //       const filteredComments = comments.filter((comment) => comment.id !== commentId);
  //       const updatedComments = filteredComments.map((comment) => ({
  //         ...comment,
  //         replies: comment.replies.filter((reply) => reply.id !== commentId),
  //       }));

  //       setComments(updatedComments);
  //     }
  //   } catch (error) {
  //     console.error('댓글 삭제 실패:', error);
  //   }
  // };

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

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      {/* 헤더 */}
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
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <PostDetailItem postDetail={postDetail} />
            <CommentList
              comments={comments}
              onAddComment={() => {}}
              onEditComment={() => {}}
              onDeleteComment={() => {}}
            />
          </div>
        </div>
      )}

      {/* 댓글 입력 필드 */}
      <div className="bg-white  shadow-strong">
        <div className="max-w-[600px] mx-auto">
          <CommentForm onSubmit={createCommentMutate} />
        </div>
      </div>
    </div>
  );
}
