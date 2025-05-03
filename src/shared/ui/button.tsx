import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2 transition-all disabled:pointer-events-none disabled:bg-label-disable',
  {
    variants: {
      variant: {
        default: 'bg-label-default hover:bg-label-sub rounded-2 typo-body-1-semibold',
        icon: 'bg-label-default hover:bg-label-sub rounded-6',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-6.5 px-2 py-1',
        icon: 'size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), 'text-white')}
      {...props}
    />
  );
}

export { Button, buttonVariants };
