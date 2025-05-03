'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

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
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(commentId, content);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxRows={2}
        className="w-full border-border-default"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="icon" size="sm" className="h-auto py-1 px-2" onClick={onCancel}>
          취소
        </Button>
        <Button variant="default" size="sm" className="h-auto py-1 px-2" onClick={handleSubmit}>
          완료
        </Button>
      </div>
    </div>
  );
}
