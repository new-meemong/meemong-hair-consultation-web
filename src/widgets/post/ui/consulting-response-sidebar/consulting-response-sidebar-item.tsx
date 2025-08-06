import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ConsultingResponseSidebarItemProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export default function ConsultingResponseSidebarItem({
  label,
  children,
  className,
}: ConsultingResponseSidebarItemProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <p className="typo-body-1-semibold text-label-default">{label}</p>
      {children}
    </div>
  );
}
