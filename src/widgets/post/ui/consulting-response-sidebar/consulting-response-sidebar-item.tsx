import type { ReactNode } from 'react';

type ConsultingResponseSidebarItemProps = {
  label: string;
  children: ReactNode;
};

export default function ConsultingResponseSidebarItem({
  label,
  children,
}: ConsultingResponseSidebarItemProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="typo-body-1-semibold text-label-default">{label}</p>
      {children}
    </div>
  );
}
