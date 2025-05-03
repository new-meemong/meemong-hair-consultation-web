'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { ChatInput } from '@/shared/ui/chat-input';

interface CommentEditFormProps {
  commentId: string;
  initialContent: string;
  onCancel: () => void;
  onSubmit: (commentId: string, content: string) => void;
  className?: string;
}

export function CommentEditForm({
  commentId,
  initialContent,
  onCancel,
  onSubmit,
  className,
}: CommentEditFormProps) {
  const handleSubmit = (message: string) => {
    if (message.trim()) {
      onSubmit(commentId, message);
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <ChatInput onSend={handleSubmit} initialMessage={initialContent} />
      <div className="flex gap-2 justify-end">
        <Button variant="icon" size="sm" className="h-auto py-1 px-2" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
}
