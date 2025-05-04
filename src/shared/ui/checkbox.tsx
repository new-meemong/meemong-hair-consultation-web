import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/shared/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-4 border border-border-default focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-label-default data-[state=checked]:border-0',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('items-center justify-center text-current')}>
      {/* 체크박스 아이콘 또는 내용 */}
      <svg
        width="14"
        height="14"
        viewBox="-1 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.7694 3.46967C11.0623 3.76256 11.0623 4.23744 10.7694 4.53033L5.48611 9.81366C5.19322 10.1066 4.71834 10.1066 4.42545 9.81366L2.95545 8.34366C2.66256 8.05077 2.66256 7.57588 2.95545 7.28299C3.24834 6.9901 3.72322 6.9901 4.01611 7.28299L4.95578 8.22266L9.70878 3.46967C10.0017 3.17678 10.4765 3.17678 10.7694 3.46967Z"
          fill="white"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
