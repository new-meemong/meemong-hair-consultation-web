import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';
import { MeemongTypography } from '@/shared/styles/typography';

type MeemongChipProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function MeemongChip({ className, children, ...props }: MeemongChipProps) {
  return (
    <span
      className={cn(
        'inline-flex h-9 items-center justify-center gap-1 overflow-hidden rounded-full border border-border-regular bg-fill-white px-3 text-text-primary',
        MeemongTypography.body4Regular,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
