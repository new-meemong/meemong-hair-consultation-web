'use client';

import CommentIcon from '@/assets/icons/comment.svg';
import ShareIcon from '@/assets/icons/share.svg';
import { type CommentWithReplies, CURRENT_USER } from '@/entities/comment';
import { type Post } from '@/entities/posts';
import { CommentForm, createComment, deleteComment, updateComment } from '@/features/comments';
import { LikeButton } from '@/features/likes';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { Avatar, AvatarFallback, AvatarImage, ImageViewer, Separator } from '@/shared/ui';
import { CommentList } from '@/widgets/comments';
import { SiteHeader } from '@/widgets/header';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function PostDetailPage() {
  const { id } = useParams();

  const { data: response } = useGetPostDetail(id?.toString() ?? '');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  const handleEditComment = async (commentId: string, newContent: string) => {
    try {
      const updatedComment = await updateComment({ commentId, content: newContent });

      setComments((prev) => {
        return prev.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, content: updatedComment.content };
          }

          if (comment.replies.some((reply) => reply.id === commentId)) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId ? { ...reply, content: updatedComment.content } : reply,
              ),
            };
          }

          return comment;
        });
      });
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const result = await deleteComment(commentId);

      if (result.success) {
        const filteredComments = comments.filter((comment) => comment.id !== commentId);
        const updatedComments = filteredComments.map((comment) => ({
          ...comment,
          replies: comment.replies.filter((reply) => reply.id !== commentId),
        }));

        setComments(updatedComments);
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  if (!response?.data) return null;

  const {
    title,
    content,
    createdAt,
    images,
    likeCount,
    commentCount,
    isFavorited,
    hairConsultPostingCreateUserName: authorName,
    hairConsultPostingCreateUserProfileImageUrl: authorImageUrl,
  } = response.data;

  return (
    <div className="min-w-[375px] w-full mx-auto">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" showBackButton />

      {/* 게시글 정보 */}
      <div className="flex flex-col gap-5 py-6">
        <div className="flex flex-col gap-5 px-5">
          <div className="flex items-center gap-2">
            <Avatar>
              {authorImageUrl ? (
                <AvatarImage src={authorImageUrl} className="w-12 h-12 rounded-6" />
              ) : (
                <AvatarFallback>
                  <Image
                    src="/profile.svg"
                    alt="프로필"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <p className="typo-body-1-semibold text-label-default">{authorName}</p>
              <p className="typo-body-3-regular text-label-info">{createdAt}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="typo-headline-bold text-label-strong">{title}</h1>
            <p className="typo-body-1-regular text-label-default">{content}</p>
          </div>
        </div>

        {/* 게시글 이미지 */}
        <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative min-w-35 h-35 rounded-6 cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <Image src={image} alt={`게시글 이미지 ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* 이미지 확대 모달 */}
        <ImageViewer
          images={images}
          initialIndex={selectedImageIndex}
          open={imageViewerOpen}
          onOpenChange={setImageViewerOpen}
        />
      </div>

      <Separator className="w-full bg-border-default h-0.25" />
      <div className="flex items-center justify-between gap-5 py-4 px-5">
        <div className="flex flex-1 justify-center items-center gap-1">
          {/* 좋아요 버튼 */}
          <LikeButton initialLiked={isFavorited} initialCount={likeCount} />
        </div>
        <div className="flex flex-1 justify-center items-center gap-1">
          <CommentIcon className="w-5 h-5 fill-label-placeholder" />
          <span className="typo-body-1-medium text-label-info">{commentCount}</span>
        </div>
        <div className="flex flex-1 justify-center items-center gap-1">
          <ShareIcon className="w-5 h-5 fill-label-placeholder" />
          <span className="typo-body-1-medium text-label-info">공유</span>
        </div>
      </div>
      <Separator className="w-full bg-border-default h-0.25" />

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
