import { PlusIcon } from 'lucide-react';
import type { ReactNode } from 'react';

function ActionItem({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="flex flex-col gap-2 size-13 rounded-6 bg-label-default">{icon}</div>
      <p className="typo-caption-1-regular text-label-info">{label}</p>
    </div>
  );
}

export default function ChatMessageActionBox() {
  return (
    <div className="flex flex-col py-8 gap-5">
      <ActionItem label="이미지 추가" icon={<PlusIcon className="size-8 fill-white" />} />
    </div>
  );
}
