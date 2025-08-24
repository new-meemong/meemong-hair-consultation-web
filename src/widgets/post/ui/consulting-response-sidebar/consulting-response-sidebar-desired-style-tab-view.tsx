import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Separator } from '@/shared';

import ConsultingResponseSidebarItem from './consulting-response-sidebar-item';

type ConsultingResponseSidebarDesiredStyleTabViewProps = {
  description: string | null;
  images: string[];
};

export default function ConsultingResponseSidebarDesiredStyleTabView({
  description,
  images,
}: ConsultingResponseSidebarDesiredStyleTabViewProps) {
  return (
    <div className={cn('flex, flex-col, gap-5 pb-8')}>
      {description && (
        <div className="flex flex-col gap-4 pb-5 pt-8">
          <ConsultingResponseSidebarItem label="추구미 설명">
            <p className="typo-body-2-long-regular text-label-info whitespace-pre-line">
              {description}
            </p>
          </ConsultingResponseSidebarItem>
          <Separator />
        </div>
      )}
      {images.map((image, index) => (
        <Image
          key={`${image}-${index}`}
          src={image}
          alt="추구미 이미지"
          className="size-62 object-cover"
          width={248}
          height={248}
        />
      ))}
    </div>
  );
}
