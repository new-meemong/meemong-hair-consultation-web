import type { ReactNode } from 'react';

type ConsultingResponseItemProps = {
  title: string;
  content: string;
  children: ReactNode;
};

export default function ConsultingResponseItem({
  title,
  content,
  children,
}: ConsultingResponseItemProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="typo-body-1-medium text-label-default">{title}</p>
        <p className="typo-body-3-regular text-label-info whitespace-pre-line">{content}</p>
      </div>
      {children}
    </div>
  );
}
