'use client';

import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';

import CommentListItem from './comment-list-item';

interface CommentListProps {
  comments: CommentWithReplyStatus[];
  fetchNextPage: () => void;
  onReplyClick: (commentId: number) => void;
  focusedCommentId: number | null;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number) => void;
  onReport: (commentId: number) => void;
  onTriggerClick: () => void;
}

export function CommentList({
  comments,
  fetchNextPage,
  onReplyClick,
  focusedCommentId,
  onDelete,
  onEdit,
  onReport,
  onTriggerClick,
}: CommentListProps) {
  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  const isFocused = (commentId: number) => focusedCommentId === commentId;

  return (
    <>
      {comments.map((comment, index) => (
        <div key={comment.id} ref={index === comments.length - 2 ? observerRef : undefined}>
          <CommentListItem
            comment={comment}
            onReplyClick={onReplyClick}
            isFocused={isFocused(comment.id)}
            onDelete={() => onDelete(comment.id)}
            onEdit={() => onEdit(comment.id)}
            onReport={() => onReport(comment.id)}
            onTriggerClick={() => onTriggerClick()}
          />
        </div>
      ))}
    </>
  );
}
