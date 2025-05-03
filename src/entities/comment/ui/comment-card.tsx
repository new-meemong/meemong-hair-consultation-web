'use client';

import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { Comment } from '../model/types';
import LockIcon from '@/assets/icons/lock.svg';

interface CommentCardProps {
  comment: Comment;
  isCurrentUser: boolean;
  showReplyButton?: boolean;
  onReply?: (commentId: string) => void;
  className?: string;
  isReply?: boolean;
}

export function CommentCard({
  comment,
  isCurrentUser,
  showReplyButton = true,
  onReply,
  className,
  isReply = false,
}: CommentCardProps) {
  const { author, content, createdAt, isPrivate } = comment;

  return (
    <div className={cn('flex gap-3', isReply && 'pl-8', className)}>
      {isReply && (
        <div className="absolute -left-2 -top-6 h-10 w-6 border-l-2 border-b-2 border-border-default rounded-bl-lg" />
      )}

      <Avatar className="size-10 shrink-0">
        <AvatarImage src={author.avatarUrl} />
        <AvatarFallback>{author.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'typo-body-2-medium',
              isCurrentUser ? 'text-primary-default' : 'text-label-info',
            )}
          >
            {author.name}
          </span>

          {isPrivate && <LockIcon className="size-3.5 fill-negative" />}

          <span className="typo-body-3-regular text-label-info">
            {format(new Date(createdAt), 'MM/dd HH:mm')}
          </span>
        </div>

        <p className="typo-body-2-medium mt-1 break-words">{content}</p>

        {showReplyButton && !isReply && (
          <button
            className="typo-body-3-medium text-label-info mt-2"
            onClick={() => onReply?.(comment.id)}
          >
            답글 달기
          </button>
        )}
      </div>
    </div>
  );
}
