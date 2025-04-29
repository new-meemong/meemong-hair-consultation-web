import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-label-default placeholder:text-label-placeholder flex w-full min-w-0 min-h-0 border bg-transparent transition-color outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed ',
        'outline-none border-none typo-body-2-long-regular',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
