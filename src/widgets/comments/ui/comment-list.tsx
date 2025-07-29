'use client';

import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import CommentListItem from './comment-list-item';

interface CommentListProps {
  comments: CommentWithReplyStatus[];
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <>
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
    </>
  );
}
