import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type FormItemWithLabelProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
  hasUnderline?: boolean;
  className?: string;
};

export default function FormItemWithLabel({
  label,
  children,
  required = false,
  hasUnderline = false,
  className,
}: FormItemWithLabelProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        className,
        hasUnderline && 'border-b-1 border-border-strong',
      )}
    >
      <div className="flex gap-1 items-center">
        <p className="typo-body-3-medium text-label-default">{label}</p>
        {required && <span className="w-1 h-1 bg-negative-light rounded-full" />}
      </div>
      {children}
    </div>
  );
}
