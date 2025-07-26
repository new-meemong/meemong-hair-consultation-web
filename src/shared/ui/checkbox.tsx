import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

import SquareCheckboxIcon from '@/assets/icons/square-checkbox.svg';
import RoundCheckboxIcon from '@/assets/icons/round-checkbox.svg';
import RoundCheckboxEmptyIcon from '@/assets/icons/round-checkbox-empty.svg';
import { cn } from '@/shared/lib/utils';

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  shape?: 'square' | 'round';
};

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, shape, ...props }, ref) => {
    console.log('shape', shape);
    return (
      <div className="size-6 flex items-center justify-center">
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            'peer focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            shape === 'square' &&
              'size-5 border border-border-default data-[state=checked]:border-0',
            className,
          )}
          {...props}
        >
          {shape === 'round' && (
            <>{props.checked ? <RoundCheckboxIcon /> : <RoundCheckboxEmptyIcon />}</>
          )}
          {shape === 'square' && (
            <CheckboxPrimitive.Indicator>
              <SquareCheckboxIcon />
            </CheckboxPrimitive.Indicator>
          )}
        </CheckboxPrimitive.Root>
      </div>
    );
  },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
