'use client';
import { useEffect, useRef, useCallback, useState, forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  hasBorder?: boolean;
  fullHeight?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows = 2, value, hasBorder = false, fullHeight = false, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const adjustHeight = useCallback(() => {
      if (fullHeight) return;

      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = '0';

      const lineHeight = 22;
      const maxHeight = maxRows * lineHeight;

      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(scrollHeight, maxHeight);
      const shouldOverflow = scrollHeight > maxHeight;

      textarea.style.height = `${Math.max(newHeight, lineHeight)}px`;
      setIsOverflowing(shouldOverflow);
    }, [maxRows, fullHeight]);

    useEffect(() => {
      if (textareaRef.current && !fullHeight) {
        adjustHeight();
      }
    }, [adjustHeight, value, fullHeight]);

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
          'flex w-full h-auto typo-body-2-long-regular text-label-default placeholder:text-label-placeholder outline-none resize-none',
          fullHeight ? 'h-full overflow-y-auto' : isOverflowing ? 'overflow-y-auto' : 'overflow-hidden',
          hasBorder && 'p-3 rounded-6 border-1 border-border-default',
          className,
        )}
        onInput={fullHeight ? undefined : adjustHeight}
        rows={1}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
