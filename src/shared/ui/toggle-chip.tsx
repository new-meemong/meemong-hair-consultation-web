'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Toggle } from './toggle';

interface ToggleChipProps extends React.ComponentPropsWithoutRef<typeof Toggle> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function ToggleChip({ className, icon, children, ...props }: ToggleChipProps) {
  return (
    <Toggle
      className={cn(
        'group flex flex-shrink-0 items-center justify-center gap-1 px-4 py-2 rounded-full transition-colors h-10',
        'typo-body-2-medium',
        'data-[state=on]:bg-label-default data-[state=on]:text-white data-[state=on]:border data-[state=on]:border-label-default',
        'data-[state=off]:bg-white data-[state=off]:border data-[state=off]:border-border-default',
        className,
      )}
      {...props}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </Toggle>
  );
}

export function ToggleChipGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex gap-2', className)}>{children}</div>;
}
