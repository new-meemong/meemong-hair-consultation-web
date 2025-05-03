import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows = 2, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = 'auto';
      const lineHeight = 8;
      const newHeight = Math.min(textarea.scrollHeight, maxRows * lineHeight);
      textarea.style.height = `${newHeight}px`;
    }, [maxRows]);

    useEffect(() => {
      if (textareaRef.current) {
        adjustHeight();
      }
    }, [adjustHeight, props.value]);

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
          'flex w-full rounded-4 placeholder:text-label-disable outline-none resize-none',
          className,
        )}
        onInput={adjustHeight}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
