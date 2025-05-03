'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { MoreOptionsMenu } from '@/shared/ui/more-options-menu';
import { CommentEditForm } from '@/features/comments/ui/comment-edit-form';
import type { Comment } from '../model/types';
import LockIcon from '@/assets/icons/lock.svg';
import MoreIcon from '@/assets/icons/more-vertical.svg';
import ReplyIcon from '@/assets/icons/reply.svg';

interface CommentCardProps {
  comment: Comment;
  isCurrentUser: boolean;
  showReplyButton?: boolean;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  className?: string;
  isReply?: boolean;
}

export function CommentCard({
  comment,
  isCurrentUser,
  showReplyButton = true,
  onReply,
  onEdit,
  onDelete,
  onReport,
  className,
  isReply = false,
}: CommentCardProps) {
  const { author, content, createdAt, isPrivate } = comment;
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitEdit = (commentId: string, newContent: string) => {
    onEdit?.(commentId, newContent);
    setIsEditing(false);
  };

  const getMoreOptions = () => {
    if (isCurrentUser) {
      return [
        {
          label: '수정하기',
          onClick: handleEdit,
        },
        {
          label: '삭제하기',
          onClick: () => onDelete?.(comment.id),
          className: 'text-negative',
        },
      ];
    }

    return [
      {
        label: '신고하기',
        onClick: () => onReport?.(comment.id),
        className: 'text-negative',
      },
    ];
  };

  return (
    <div className={cn('flex gap-3 p-5', isReply && 'bg-alternative', className)}>
      {isReply && <ReplyIcon className="size-4.5 fill-label-info self-start flex-shrink-0" />}

      <div className="flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={author.avatarUrl} />
              <AvatarFallback>
                <Image src="/profile.svg" alt="프로필" fill className="object-cover" />
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'typo-body-1-semibold',
                isCurrentUser ? 'text-negative-light' : 'text-label-info',
              )}
            >
              ems-{author.name}
            </span>
            {isPrivate && <LockIcon className="size-3.5 fill-negative" />}
          </div>

          <div className="flex items-center gap-2">
            <span className="typo-body-3-regular text-label-info">
              {format(new Date(createdAt), 'MM/dd HH:mm')}
            </span>

            <MoreOptionsMenu
              trigger={<MoreIcon className="size-6 fill-label-info cursor-pointer" />}
              options={getMoreOptions()}
            />
          </div>
        </div>
        <div>
          {isEditing ? (
            <CommentEditForm
              commentId={comment.id}
              initialContent={content}
              onCancel={handleCancelEdit}
              onSubmit={handleSubmitEdit}
              className="mt-2"
            />
          ) : (
            <div>
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
          )}
        </div>
      </div>
    </div>
  );
}
