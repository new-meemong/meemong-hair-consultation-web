'use client';

import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { type CommentWithReplies } from '@/entities/comment';
import { CommentForm } from '@/features/comments';
import useCreateCommentMutation from '@/features/comments/api/use-create-comment-mutation';
import useDeletePostMutation from '@/features/posts/api/use-delete-post-mutation';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import useShowDeletePostConfirmModal from '@/features/posts/hooks/use-show-delete-post-confirm-modal';
import PostDetailItem from '@/features/posts/ui/post-detail-item';
import { MoreOptionsMenu, ROUTES } from '@/shared';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useAuthContext } from '@/shared/context/auth-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowConfirmModal from '@/shared/ui/hooks/use-show-confirm-modal';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function PostDetailPage() {
  const { isUserDesigner, user } = useAuthContext();

  useGuidePopup(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { id: postId } = useParams();

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const isWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   /**
  //    * 현재 모킹 데이터로 처리
  //    */
  //   const loadData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const postData = await fetchPostDetail(postId);
  //       setPost(postData);
  //       const commentData = await fetchComments(postId);
  //       setComments(commentData);
  //     } catch (error) {
  //       console.error('데이터 로드 실패:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [postId]);

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

  const showDeletePostConfirmModal = useShowDeletePostConfirmModal();
  const { mutate: deletePost } = useDeletePostMutation();

  const showConfirmModal = useShowConfirmModal();

  const handleDelete = () => {
    showDeletePostConfirmModal({
      onDelete: () => {
        deletePost(Number(postId), {
          onSuccess: () => {
            showConfirmModal({
              text: '삭제가 완료되었습니다',
              onConfirm: () => {
                push(ROUTES.POSTS);
              },
            });
          },
        });
      },
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

  return (
    <div className="min-w-[375px] w-full mx-auto">
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
      {postDetail && <PostDetailItem postDetail={postDetail} />}

      {/* 댓글 섹션 */}
      {/* <div className="px-5">
        <CommentList
          comments={comments}
          currentUserId={CURRENT_USER.id}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          className="mb-4"
        />
      </div> */}

      <div className="h-30" />
      {/* 댓글 입력 필드 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-strong">
        <div className="max-w-[600px] mx-auto">
          <CommentForm onSubmit={createCommentMutate} />
        </div>
      </div>
    </div>
  );
}
