import React, { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows = 5, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = 'auto';
      const lineHeight = 20; // 기본 라인 높이는 20px로 가정
      const newHeight = Math.min(textarea.scrollHeight, maxRows * lineHeight);
      textarea.style.height = `${newHeight}px`;
    };

    useEffect(() => {
      if (textareaRef.current) {
        adjustHeight();
      }
    }, [props.value]);

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
          'flex min-h-10 w-full rounded-4 bg-transparent px-3 py-2 placeholder:text-label-disable outline-none',
          className,
        )}
        onInput={adjustHeight}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
