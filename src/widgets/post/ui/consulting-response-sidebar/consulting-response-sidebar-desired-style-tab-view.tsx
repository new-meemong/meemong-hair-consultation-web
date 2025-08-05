import { cn } from '@/lib/utils';
import { Separator } from '@/shared';
import Image from 'next/image';

type ConsultingResponseSidebarDesiredStyleTabViewProps = {
  description?: string;
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
          <div className="flex flex-col gap-4">
            <p className="typo-body-1-semibold text-label-default">추구미 설명</p>
            <p className="typo-body-2-long-regular text-label-info whitespace-pre-line">
              {description}
            </p>
          </div>
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
