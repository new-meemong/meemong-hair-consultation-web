'use client';

import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import CommentListItem from './comment-list-item';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';

interface CommentListProps {
  comments: CommentWithReplyStatus[];
  fetchNextPage: () => void;
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
}

export function CommentList({ comments, fetchNextPage }: CommentListProps) {
  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  return (
    <>
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
      <div className="h-1" ref={observerRef} />
    </>
  );
}
