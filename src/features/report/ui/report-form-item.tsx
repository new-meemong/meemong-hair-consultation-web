import type { ReactNode } from 'react';

type ReportFormItemProps = {
  label: string;
  description?: string;
  children?: ReactNode;
};

export default function ReportFormItem({ label, description, children }: ReportFormItemProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="typo-body-1-semibold text-label-sub">{label}</p>
        {description && <p className="typo-body-2-regular text-label-sub">{description}</p>}
      </div>
      {children}
    </div>
  );
}
