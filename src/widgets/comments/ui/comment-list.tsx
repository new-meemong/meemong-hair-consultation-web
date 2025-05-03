'use client';

import React, { useState } from 'react';
import { CommentCard } from '@/entities/comment/ui/comment-card';
import { CommentForm } from '@/features/comments/ui/comment-form';
import { CommentActions } from '@/features/comments/ui/comment-actions';
import { cn } from '@/shared/lib/utils';
import type { Comment, CommentWithReplies } from '@/entities/comment/model/types';

interface CommentListProps {
  comments: CommentWithReplies[];
  currentUserId: string;
  onAddComment: (content: string, isPrivate: boolean, parentId?: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  className?: string;
}

export function CommentList({
  comments,
  currentUserId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  className,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleSubmitReply = (content: string, isPrivate: boolean, parentId?: string) => {
    onAddComment(content, isPrivate, parentId);
    setReplyingTo(null);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <CommentForm onSubmit={(content, isPrivate) => onAddComment(content, isPrivate)} />

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <div className="relative">
              <CommentCard
                comment={comment}
                isCurrentUser={comment.author.id === currentUserId}
                onReply={handleReply}
              />
              {comment.author.id === currentUserId && (
                <CommentActions
                  comment={comment}
                  isCurrentUser={true}
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                />
              )}
            </div>

            {replyingTo === comment.id && (
              <CommentForm
                onSubmit={(content, isPrivate) => handleSubmitReply(content, isPrivate, comment.id)}
                isReply
                parentAuthorName={comment.author.name}
              />
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="relative pl-8 space-y-4 mt-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="relative">
                    <CommentCard
                      comment={reply}
                      isCurrentUser={reply.author.id === currentUserId}
                      showReplyButton={false}
                      isReply
                    />
                    {reply.author.id === currentUserId && (
                      <CommentActions
                        comment={reply}
                        isCurrentUser={true}
                        onEdit={onEditComment}
                        onDelete={onDeleteComment}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
