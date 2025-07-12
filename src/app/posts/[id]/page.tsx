// 'use client';

// import CommentIcon from '@/assets/icons/comment.svg';
// import ShareIcon from '@/assets/icons/share.svg';
// import { CommentWithReplies, CURRENT_USER } from '@/entities/comment';
// import { type Post } from '@/entities/posts';
// import { CommentForm, createComment, deleteComment, updateComment } from '@/features/comments';
// import { LikeButton } from '@/features/likes';
// import { Avatar, AvatarFallback, AvatarImage, ImageViewer, Separator } from '@/shared/ui';
// import { CommentList } from '@/widgets/comments';
// import { SiteHeader } from '@/widgets/header';
// import Image from 'next/image';
// import { useParams } from 'next/navigation';
// import { useState } from 'react';

// export default function PostDetailPage() {
//   const params = useParams();
//   const postId = params.id as string;
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [post, setPost] = useState<Post | null>(null);
//   const [comments, setComments] = useState<CommentWithReplies[]>([]);
//   const [imageViewerOpen, setImageViewerOpen] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [isLoading, setIsLoading] = useState(true);

//   // useEffect(() => {
//   //   /**
//   //    * 현재 모킹 데이터로 처리
//   //    */
//   //   const loadData = async () => {
//   //     setIsLoading(true);
//   //     try {
//   //       const postData = await fetchPostDetail(postId);
//   //       setPost(postData);
//   //       const commentData = await fetchComments(postId);
//   //       setComments(commentData);
//   //     } catch (error) {
//   //       console.error('데이터 로드 실패:', error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   loadData();
//   // }, [postId]);

//   const handleAddComment = async (content: string, isPrivate: boolean, parentId?: string) => {
//     try {
//       const newComment = await createComment({
//         content,
//         isPrivate,
//         parentId,
//         postId: postId,
//       });

//       if (parentId) {
//         setComments((prev) =>
//           prev.map((comment) => {
//             if (comment.id === parentId) {
//               return {
//                 ...comment,
//                 replies: [...comment.replies, newComment],
//               };
//             }
//             return comment;
//           }),
//         );
//       } else {
//         setComments((prev) => [...prev, { ...newComment, replies: [] } as CommentWithReplies]);
//       }
//     } catch (error) {
//       console.error('댓글 추가 실패:', error);
//     }
//   };

//   const handleEditComment = async (commentId: string, newContent: string) => {
//     try {
//       const updatedComment = await updateComment({ commentId, content: newContent });

//       setComments((prev) => {
//         return prev.map((comment) => {
//           if (comment.id === commentId) {
//             return { ...comment, content: updatedComment.content };
//           }

//           if (comment.replies.some((reply) => reply.id === commentId)) {
//             return {
//               ...comment,
//               replies: comment.replies.map((reply) =>
//                 reply.id === commentId ? { ...reply, content: updatedComment.content } : reply,
//               ),
//             };
//           }

//           return comment;
//         });
//       });
//     } catch (error) {
//       console.error('댓글 수정 실패:', error);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       const result = await deleteComment(commentId);

//       if (result.success) {
//         const filteredComments = comments.filter((comment) => comment.id !== commentId);
//         const updatedComments = filteredComments.map((comment) => ({
//           ...comment,
//           replies: comment.replies.filter((reply) => reply.id !== commentId),
//         }));

//         setComments(updatedComments);
//       }
//     } catch (error) {
//       console.error('댓글 삭제 실패:', error);
//     }
//   };

//   const handleImageClick = (index: number) => {
//     setSelectedImageIndex(index);
//     setImageViewerOpen(true);
//   };

//   if (isLoading || !post) {
//     return <div className="min-w-[375px] w-full mx-auto pb-20">로딩 중...</div>;
//   }

//   const postImages = [
//     post.repImageUrl || 'https://picsum.photos/400/400?random=1',
//     'https://picsum.photos/400/400?random=2',
//     'https://picsum.photos/400/400?random=3',
//   ];

//   return (
//     <div className="min-w-[375px] w-full mx-auto">
//       {/* 헤더 */}
//       <SiteHeader title="헤어상담" showBackButton />

//       {/* 게시글 정보 */}
//       <div className="pl-5 py-6">
//         <div className="flex items-center gap-2">
//           <Avatar>
//             <AvatarImage src={post.author.avatarUrl} className="w-12 h-12 rounded-6" />
//             <AvatarFallback>
//               <Image
//                 src="/profile.svg"
//                 alt="프로필"
//                 width={36}
//                 height={36}
//                 className="object-cover"
//               />
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex flex-col">
//             <p className="typo-body-1-semibold text-label-default">{post.author.name}</p>
//             <p className="typo-body-3-regular text-label-info">{post.createdAt}</p>
//           </div>
//         </div>

//         <h1 className="typo-headline-bold text-label-strong mt-2 mb-3 pr-5">{post.title}</h1>
//         <p className="typo-body-1-regular text-label-default mb-4 pr-5">{post.content}</p>

//         {/* 게시글 이미지 */}
//         <div className="flex gap-2 overflow-x-auto scrollbar-hide">
//           {postImages.map((image, index) => (
//             <div
//               key={index}
//               className={`relative min-w-35 h-35 rounded-6 overflow-hidden cursor-pointer ${
//                 index === postImages.length - 1 ? 'mr-5' : ''
//               }`}
//               onClick={() => handleImageClick(index)}
//             >
//               <Image src={image} alt={`게시글 이미지 ${index + 1}`} fill className="object-cover" />
//             </div>
//           ))}
//         </div>

//         {/* 이미지 확대 모달 */}
//         <ImageViewer
//           images={postImages}
//           initialIndex={selectedImageIndex}
//           open={imageViewerOpen}
//           onOpenChange={setImageViewerOpen}
//         />
//       </div>

//       <Separator className="w-full bg-border-default h-0.25" />
//       <div className="flex items-center justify-between gap-5 py-4 px-5">
//         <div className="flex flex-1 justify-center items-center gap-1">
//           {/* 좋아요 버튼 */}
//           <LikeButton initialLiked={false} initialCount={post.likes} />
//         </div>
//         <div className="flex flex-1 justify-center items-center gap-1">
//           <CommentIcon className="w-5 h-5 fill-label-placeholder" />
//           <span className="typo-body-1-medium text-label-info">{post.comments}</span>
//         </div>
//         <div className="flex flex-1 justify-center items-center gap-1">
//           <ShareIcon className="w-5 h-5 fill-label-placeholder" />
//           <span className="typo-body-1-medium text-label-info">공유</span>
//         </div>
//       </div>
//       <Separator className="w-full bg-border-default h-0.25" />

//       {/* 광고 영역 */}
//       <div className="h-20 bg-positive m-4 rounded-md flex items-center justify-center"></div>

//       {/* 댓글 섹션 */}
//       <div className="px-5">
//         <CommentList
//           comments={comments}
//           currentUserId={CURRENT_USER.id}
//           onAddComment={handleAddComment}
//           onEditComment={handleEditComment}
//           onDeleteComment={handleDeleteComment}
//           className="mb-4"
//         />
//       </div>

//       <div className="h-30" />
//       {/* 댓글 입력 필드 */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-strong">
//         <div className="max-w-[600px] mx-auto">
//           <CommentForm onSubmit={(content, isPrivate) => handleAddComment(content, isPrivate)} />
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';

function page() {
  return <div>page</div>;
}

export default page;
