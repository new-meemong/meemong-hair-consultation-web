import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { Separator } from '@/shared/ui/separator';

type MeemongDividerProps = ComponentProps<'div'> & {
  thickness?: '1px' | '8px';
};

export function MeemongDivider({ thickness = '1px', className, ...props }: MeemongDividerProps) {
  if (thickness === '1px') {
    return <Separator className={cn('bg-divider-weak', className)} {...props} />;
  }

  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn('h-2 w-full shrink-0 bg-background-weak', className)}
    />
  );
}
