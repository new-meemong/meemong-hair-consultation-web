'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows = 2, value, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = '0';

      const lineHeight = 22;

      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(scrollHeight, maxRows * lineHeight);

      textarea.style.height = `${Math.max(newHeight, lineHeight)}px`;
    }, [maxRows]);

    useEffect(() => {
      if (textareaRef.current) {
        adjustHeight();
      }
    }, [adjustHeight, value]);

    return (
      <textarea
        ref={(node) => {
          textareaRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          'flex w-full h-auto text-label-default placeholder:text-label-disable outline-none resize-none overflow-hidden',
          className,
        )}
        onInput={adjustHeight}
        rows={1}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
