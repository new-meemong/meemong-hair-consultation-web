import type { ReactNode } from 'react';

type FormItemWithLabelProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
};

export default function FormItemWithLabel({
  label,
  children,
  required = false,
}: FormItemWithLabelProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <p className="typo-body-3-medium text-label-default">{label}</p>
        {required && <span className="w-1 h-1 bg-negative-light rounded-full" />}
      </div>
      {children}
    </div>
  );
}
