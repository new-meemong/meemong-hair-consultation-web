import type { ReactNode } from 'react';
import GalleryIcon from '@/assets/icons/gallery.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import ResumeIcon from '@/assets/icons/resume.svg';
import ContractIcon from '@/assets/icons/contract.svg';
import type { ValueOf } from '@/shared/type/types';
import ImageUploader from '@/shared/ui/image-uploader';

const ACTION_ITEM_VALUE = {
  PHOTO: 'photo',
  SCHEDULE: 'schedule',
  RESUME: 'resume',
  CONTRACTING: 'contracting',
} as const;

const ACTION_ITEMS = Object.values(ACTION_ITEM_VALUE);

function ActionItem({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="flex flex-col size-13 rounded-6 bg-label-default items-center justify-center">
        {icon}
      </div>
      <p className="typo-caption-1-regular text-label-info">{label}</p>
    </div>
  );
}

export default function ChatMessageActionBox() {
  const handleImageUpload = (file: File) => {
    console.log(file);
  };

  const renderItem = (
    item: ValueOf<typeof ACTION_ITEM_VALUE>,
  ): { label: string; icon: ReactNode } => {
    switch (item) {
      case ACTION_ITEM_VALUE.PHOTO:
        return {
          label: '사진',
          icon: <GalleryIcon className="size-8 fill-white" />,
        };
      case ACTION_ITEM_VALUE.SCHEDULE:
        return {
          label: '약속잡기',
          icon: <CalendarIcon className="size-8 fill-white" />,
        };
      case ACTION_ITEM_VALUE.RESUME:
        return {
          label: '이력서',
          icon: <ResumeIcon className="size-8 fill-white" />,
        };
      case ACTION_ITEM_VALUE.CONTRACTING:
        return {
          label: '초상권계약',
          icon: <ContractIcon className="size-8 fill-white" />,
        };
    }
  };
  return (
    <div className="flex justify-between px-3">
      {ACTION_ITEMS.map((item) => {
        const { label, icon } = renderItem(item);

        if (item === ACTION_ITEM_VALUE.PHOTO) {
          return (
            <ImageUploader key={label} setImages={handleImageUpload}>
              <ActionItem label={label} icon={icon} />
            </ImageUploader>
          );
        }

        return <ActionItem key={label} label={label} icon={icon} />;
      })}
    </div>
  );
}
