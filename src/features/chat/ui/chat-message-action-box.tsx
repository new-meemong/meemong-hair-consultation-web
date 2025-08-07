import type { ReactNode } from 'react';
import GalleryIcon from '@/assets/icons/gallery.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import ResumeIcon from '@/assets/icons/resume.svg';
import ContractIcon from '@/assets/icons/contract.svg';

const ACTION_ITEM_VALUE = {
  PHOTO: 'photo',
  SCHEDULE: 'schedule',
  RESUME: 'resume',
  CONTRACTING: 'contracting',
} as const;

const ACTION_ITEM = {
  [ACTION_ITEM_VALUE.PHOTO]: {
    label: '사진',
    icon: <GalleryIcon className="size-8 fill-white" />,
  },
  [ACTION_ITEM_VALUE.SCHEDULE]: {
    label: '약속잡기',
    icon: <CalendarIcon className="size-8 fill-white" />,
  },
  [ACTION_ITEM_VALUE.RESUME]: {
    label: '이력서',
    icon: <ResumeIcon className="size-8 fill-white" />,
  },
  [ACTION_ITEM_VALUE.CONTRACTING]: {
    label: '초상권계약',
    icon: <ContractIcon className="size-8 fill-white" />,
  },
} as const;

const ACTION_ITEMS = Object.values(ACTION_ITEM);

function ActionItem({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="flex flex-col gap-2 size-13 rounded-6 bg-label-default items-center justify-center">
        {icon}
      </div>
      <p className="typo-caption-1-regular text-label-info">{label}</p>
    </div>
  );
}

export default function ChatMessageActionBox() {
  return (
    <div className="flex justify-between px-3">
      {ACTION_ITEMS.map((item) => (
        <ActionItem key={item.label} label={item.label} icon={item.icon} />
      ))}
    </div>
  );
}
