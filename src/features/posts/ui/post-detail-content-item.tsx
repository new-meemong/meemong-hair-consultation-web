import type { ReactNode } from 'react';

import { cn } from '@/shared';

type PostDetailContentItemProps = {
  label: string;
  children: ReactNode;
  className?: string;
};
export default function PostDetailContentItem({
  label,
  children,
  className,
}: PostDetailContentItemProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="typo-body-1-semibold text-label-default">{label}</p>
      {children}
    </div>
  );
}
