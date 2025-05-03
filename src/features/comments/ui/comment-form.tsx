'use client';

import React, { useState } from 'react';
import { ChatInput } from '@/shared/ui/chat-input';
import { PrivateChatInput } from '@/shared/ui/private-chat-input';
import { cn } from '@/shared/lib/utils';

interface CommentFormProps {
  onSubmit: (content: string, isPrivate: boolean) => void;
  isReply?: boolean;
  parentAuthorName?: string;
  className?: string;
}

export function CommentForm({
  onSubmit,
  isReply = false,
  parentAuthorName,
  className,
}: CommentFormProps) {
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (message: string) => {
    if (message.trim()) {
      onSubmit(message, isPrivate);
    }
  };

  const placeholder =
    isReply && parentAuthorName ? `${parentAuthorName}님에게 답글 작성...` : '댓글을 입력하세요';

  return (
    <div className={cn('w-full', isReply && 'pl-8', className)}>
      {isPrivate ? (
        <PrivateChatInput
          onSend={handleSubmit}
          placeholder={placeholder}
          onCheckedChange={(checked) => setIsPrivate(!!checked)}
        />
      ) : (
        <ChatInput onSend={handleSubmit} placeholder={placeholder} />
      )}
    </div>
  );
}
