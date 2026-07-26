import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type MeemongBottomActionBarProps = {
  children: ReactNode;
  type?: '1ea' | '2ea';
  className?: string;
};

export function MeemongBottomActionBar({
  children,
  type = '1ea',
  className,
}: MeemongBottomActionBarProps) {
  return (
    <div className={cn('w-full shrink-0 bg-background-white', className)}>
      <div
        className="h-4 bg-gradient-to-b from-background-white/0 to-background-white"
        aria-hidden="true"
      />
      <div
        className={cn(
          'grid gap-3 bg-background-white px-4 pt-1 pb-[max(12px,env(safe-area-inset-bottom))]',
          type === '1ea' ? 'grid-cols-1' : 'grid-cols-2',
        )}
      >
        {children}
      </div>
    </div>
  );
}
