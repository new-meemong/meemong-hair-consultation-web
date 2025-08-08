import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2 transition-all disabled:pointer-events-none disabled:bg-label-disable',
  {
    variants: {
      variant: {
        default: 'rounded-2',
        icon: 'rounded-6',
        textWithIcon: 'typo-body-1-medium flex gap-2 rounded-4',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-6.5 px-2 py-1',
        lg: 'h-13 typo-body-1-medium',
        icon: 'size-7',
        iconLg: 'size-10',
        textWithIcon: 'h-10 px-3 py-2.5',
      },
      theme: {
        black: 'typo-body-1-semibold bg-label-default hover:bg-label-sub text-white',
        white:
          'typo-body-2-medium bg-white hover:bg-label-sub text-label-sub border border-border-default',
        whiteBorder: 'rounded-4 border-1 border-white bg-transparent text-white typo-body-2-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      theme: 'black',
    },
  },
);

function Button({
  className,
  variant,
  size,
  theme,
  type = 'button',
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
      className={cn(buttonVariants({ variant, theme, size, className }))}
      type={type}
      {...props}
    />
  );
}

export { Button, buttonVariants };
