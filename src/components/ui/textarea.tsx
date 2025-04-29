import * as React from 'react';

import { cn } from '@/lib/utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  maxRows?: number;
}

function Textarea({ className, maxRows, ...props }: TextareaProps) {
  const maxHeight = maxRows ? `${maxRows * 1.5}rem` : '';

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input text-label-default placeholder:text-label-placeholder typo-body-2-long-regular flex field-sizing-content w-full bg-transparent p-2.5 break-words break-all resize-none focus:outline-none scrollbar-hide overflow-y-scroll p-0',
        className,
      )}
      style={{
        maxHeight,
      }}
      {...props}
    />
  );
}

// 스크롤바를 숨기는 CSS
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// 스타일을 동적으로 추가
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = scrollbarHideStyles;
  document.head.appendChild(style);
}

export { Textarea };
