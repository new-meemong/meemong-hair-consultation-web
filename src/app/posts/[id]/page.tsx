'use client';

import { type CommentWithReplies } from '@/entities/comment';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import PostDetailItem from '@/features/posts/ui/post-detail-item';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import { useAuthContext } from '@/shared/context/auth-context';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function PostDetailPage() {
  const { isUserDesigner } = useAuthContext();

  useGuidePopup(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { id } = useParams();

  const { data: response } = useGetPostDetail(id?.toString() ?? '');
  const postDetail = response?.data;

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

  // const handleAddComment = async (content: string, isPrivate: boolean, parentId?: string) => {
  //   try {
  //     const newComment = await createComment({
  //       content,
  //       isPrivate,
  //       parentId,
  //       postId: postId,
  //     });

  //     if (parentId) {
  //       setComments((prev) =>
  //         prev.map((comment) => {
  //           if (comment.id === parentId) {
  //             return {
  //               ...comment,
  //               replies: [...comment.replies, newComment],
  //             };
  //           }
  //           return comment;
  //         }),
  //       );
  //     } else {
  //       setComments((prev) => [...prev, { ...newComment, replies: [] } as CommentWithReplies]);
  //     }
  //   } catch (error) {
  //     console.error('댓글 추가 실패:', error);
  //   }
  // };

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

  return (
    <div className="min-w-[375px] w-full mx-auto">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" showBackButton />
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
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-strong">
        <div className="max-w-[600px] mx-auto">
          <CommentForm onSubmit={(content, isPrivate) => handleAddComment(content, isPrivate)} />
        </div>
      </div> */}
    </div>
  );
}
