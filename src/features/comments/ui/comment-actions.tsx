'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import type { Comment } from '@/entities/comment/model/types';

interface CommentActionsProps {
  comment: Comment;
  isCurrentUser: boolean;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  className?: string;
}

export function CommentActions({
  comment,
  isCurrentUser,
  onEdit,
  onDelete,
  className,
}: CommentActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  if (!isCurrentUser) return null;

  const handleSubmitEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={cn('flex flex-col gap-2 mt-2', className)}>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border border-border-default rounded-4 min-h-[100px]"
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="icon"
            size="sm"
            className="h-auto py-1 px-2"
            onClick={() => setIsEditing(false)}
          >
            취소
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-auto py-1 px-2"
            onClick={handleSubmitEdit}
          >
            완료
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2 mt-2', className)}>
      <Button
        variant="icon"
        size="sm"
        className="typo-body-3-medium h-auto py-1 px-2 text-label-info"
        onClick={() => setIsEditing(true)}
      >
        수정
      </Button>
      <Button
        variant="icon"
        size="sm"
        className="typo-body-3-medium h-auto py-1 px-2 text-negative"
        onClick={() => onDelete?.(comment.id)}
      >
        삭제
      </Button>
    </div>
  );
}
