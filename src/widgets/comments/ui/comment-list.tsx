'use client';

import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import CommentListItem from './comment-list-item';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';

interface CommentListProps {
  comments: CommentWithReplyStatus[];
  fetchNextPage: () => void;
  onReplyClick: (commentId: number) => void;
  focusedCommentId: number | null;
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
}

export function CommentList({
  comments,
  fetchNextPage,
  onReplyClick,
  focusedCommentId,
}: CommentListProps) {
  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  const isFocused = (commentId: number) => focusedCommentId === commentId;

  return (
    <>
      {comments.map((comment) => (
        <CommentListItem
          key={comment.id}
          comment={comment}
          onReplyClick={onReplyClick}
          isFocused={isFocused(comment.id)}
        />
      ))}
      <div className="h-1" ref={observerRef} />
    </>
  );
}
