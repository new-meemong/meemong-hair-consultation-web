import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

import CheckboxIcon from '@/assets/icons/checkbox.svg';
import { cn } from '@/shared/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div className="size-6 flex items-center justify-center">
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer size-5 rounded-2 border border-border-default focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-0',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        {/* 체크박스 아이콘 또는 내용 */}
        <CheckboxIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  </div>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
