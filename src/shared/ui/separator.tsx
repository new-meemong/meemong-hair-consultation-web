'use client';

import * as React from 'react';

import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & { className?: string }) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border-default shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
