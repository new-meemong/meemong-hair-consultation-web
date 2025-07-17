'use client';

import { type CommentWithReplies } from '@/entities/comment';
import { EditableCommentCard } from '@/features/comments';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

interface CommentListProps {
  comments: CommentWithReplies[];
  currentUserId: string;
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
  className?: string;
}

export function CommentList({
  comments,
  currentUserId,
  // onAddComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  className,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  // const handleSubmitReply = (content: string, isPrivate: boolean, parentId?: string) => {
  //   onAddComment(content, isPrivate, parentId);
  //   setReplyingTo(null);
  // };

  return (
    <div className={cn(className)}>
      {comments.map((comment) => (
        <div key={comment.id}>
          <div className="relative">
            <EditableCommentCard
              comment={comment}
              isCurrentUser={comment.author.id === currentUserId}
              onReply={handleReply}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              onReport={onReportComment}
            />
          </div>
          {/* {replyingTo === comment.id && (
            <CommentForm
              onSubmit={(content, isPrivate) => handleSubmitReply(content, isPrivate, comment.id)}
              isReply
              parentAuthorName={comment.author.name}
            />
          )} */}

          {comment.replies &&
            comment.replies.length > 0 &&
            comment.replies.map((reply) => (
              <div key={reply.id} className="relative">
                <EditableCommentCard
                  comment={reply}
                  isCurrentUser={reply.author.id === currentUserId}
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                  onReport={onReportComment}
                />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
