'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/widgets/header';
import { CommentList } from '@/widgets/comments';
import { ImageViewer, Separator } from '@/shared/ui';
import { RECENT_FEEDS, POPULAR_FEEDS, MY_FEEDS } from '@/entities/feed';
import { Feed } from '@/entities/feed/model/types';
import { CommentWithReplies, MOCK_COMMENTS, CURRENT_USER } from '@/entities/comment';
import CommentIcon from '@/assets/icons/comment.svg';
import ShareIcon from '@/assets/icons/share.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { CommentForm } from '@/features/comments';
import { LikeButton } from '@/features/likes';

export default function FeedDetailPage() {
  const params = useParams();
  const feedId = params.id as string;
  const [feed, setFeed] = useState<Feed | null>(null);
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 피드 데이터 불러오기 (임시로 모든 피드 데이터를 합쳐서 ID로 찾음)
  useEffect(() => {
    const allFeeds = [...RECENT_FEEDS, ...POPULAR_FEEDS, ...MY_FEEDS].filter(
      (feed, index, self) => self.findIndex((f) => f.id === feed.id) === index,
    );

    const foundFeed = allFeeds.find((item) => item.id === feedId);
    if (foundFeed) {
      setFeed(foundFeed);
    }

    // 댓글 데이터 불러오기
    setComments(MOCK_COMMENTS);
  }, [feedId]);

  // 댓글 추가
  const handleAddComment = (content: string, isPrivate: boolean, parentId?: string) => {
    const newComment = {
      id: `new-${Date.now()}`,
      content,
      author: {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatarUrl: CURRENT_USER.avatarUrl || '',
      },
      createdAt: new Date().toISOString(),
      isPrivate,
      parentId,
    };

    if (parentId) {
      // 대댓글 추가
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment],
            };
          }
          return comment;
        }),
      );
    } else {
      // 새 댓글 추가
      setComments([...comments, { ...newComment, replies: [] } as CommentWithReplies]);
    }
  };

  // 댓글 수정
  const handleEditComment = (commentId: string, newContent: string) => {
    setComments(
      comments.map((comment) => {
        // 메인 댓글 수정
        if (comment.id === commentId) {
          return { ...comment, content: newContent };
        }

        // 대댓글 수정
        if (comment.replies.some((reply) => reply.id === commentId)) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, content: newContent } : reply,
            ),
          };
        }

        return comment;
      }),
    );
  };

  // 댓글 삭제
  const handleDeleteComment = (commentId: string) => {
    const filteredComments = comments.filter((comment) => comment.id !== commentId);
    const updatedComments = filteredComments.map((comment) => ({
      ...comment,
      replies: comment.replies.filter((reply) => reply.id !== commentId),
    }));

    setComments(updatedComments);
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  if (!feed) {
    return <div className="min-w-[375px] w-full mx-auto pb-20">로딩 중...</div>;
  }

  // 임시 이미지 URL 배열 (이미지가 없을 경우 기본 이미지)
  const feedImages = [
    feed.imageUrl || 'https://picsum.photos/400/400?random=1',
    'https://picsum.photos/400/400?random=2',
    'https://picsum.photos/400/400?random=3',
  ];

  return (
    <div className="min-w-[375px] w-full mx-auto">
      {/* 헤더 */}
      <SiteHeader title="헤어상담" showBackButton />

      {/* 게시글 정보 */}
      <div className="pl-5 py-6">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={feed.author.avatarUrl} className="w-12 h-12 rounded-6" />
            <AvatarFallback>
              <Image
                src="/profile.svg"
                alt="프로필"
                width={35}
                height={35}
                className="object-cover"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="typo-body-1-semibold text-label-default">{feed.author.name}</p>
            <p className="typo-body-3-regular text-label-info">{feed.createdAt}</p>
          </div>
        </div>

        <h1 className="typo-headline-bold text-label-strong mt-2 mb-3 pr-5">{feed.title}</h1>
        <p className="typo-body-1-regular text-label-default mb-4 pr-5">{feed.content}</p>

        {/* 게시글 이미지 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {feedImages.map((image, index) => (
            <div
              key={index}
              className="relative min-w-35 h-35 rounded-6 overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <Image src={image} alt={`피드 이미지 ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* 이미지 확대 모달 */}
        <ImageViewer
          images={feedImages}
          initialIndex={selectedImageIndex}
          open={imageViewerOpen}
          onOpenChange={setImageViewerOpen}
        />
      </div>

      {/* 게시글 상호작용 */}
      <Separator className="w-full bg-border-default h-0.25" />
      <div className="flex items-center justify-between gap-5 py-4 px-5">
        <div className="flex flex-1 justify-center items-center gap-1">
          {/* 좋아요 버튼 상호작용 */}
          <LikeButton initialLiked={false} initialCount={feed.likes} />
        </div>
        <div className="flex flex-1 justify-center items-center gap-1">
          <CommentIcon className="w-5 h-5 fill-label-placeholder" />
          <span className="typo-body-1-medium text-label-info">{feed.comments}</span>
        </div>
        <div className="flex flex-1 justify-center items-center gap-1">
          <ShareIcon className="w-5 h-5 fill-label-placeholder" />
          <span className="typo-body-1-medium text-label-info">공유</span>
        </div>
      </div>
      <Separator className="w-full bg-border-default h-0.25" />

      {/* 광고 영역 */}
      <div className="h-20 bg-positive m-4 rounded-md flex items-center justify-center"></div>

      {/* 댓글 섹션 */}
      <div className="px-5">
        <CommentList
          comments={comments}
          currentUserId={CURRENT_USER.id}
          onAddComment={handleAddComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          className="mb-4"
        />
      </div>

      <div className="h-30" />
      {/* 댓글 입력 필드 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-strong">
        <div className="max-w-[600px] mx-auto">
          <CommentForm onSubmit={(content, isPrivate) => handleAddComment(content, isPrivate)} />
        </div>
      </div>
    </div>
  );
}
