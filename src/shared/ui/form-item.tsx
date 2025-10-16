import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FormItem = {
  label?: string;
  description?: string;
  children: ReactNode;
  required?: boolean;
  hasUnderline?: boolean;
  className?: string;
};

export default function FormItem({
  label,
  description,
  children,
  required = false,
  hasUnderline = false,
  className,
}: FormItem) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        className,
        hasUnderline && 'border-b-1 border-border-strong',
      )}
    >
      <div className="flex gap-1 items-center">
        {label && <p className="typo-body-2-long-medium text-label-default">{label}</p>}
        {required && <span className="w-1 h-1 bg-negative-light rounded-full" />}
      </div>
      {description && <p className="typo-body-3-regular text-label-info">{description}</p>}
      {children}
    </div>
  );
}
