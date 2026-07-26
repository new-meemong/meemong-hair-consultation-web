import type { ComponentProps } from 'react';

import Image from 'next/image';

import { cn } from '@/shared/lib/utils';

type HairConsultingImageProps = {
  src: ComponentProps<typeof Image>['src'];
  alt: string;
  className?: string;
  imageClassName?: string;
};

export default function HairConsultingImage({
  src,
  alt,
  className,
  imageClassName,
}: HairConsultingImageProps) {
  return (
    <div
      className={cn(
        'relative size-[140px] shrink-0 overflow-hidden rounded-8 border border-border-weak bg-background-white',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={140}
        height={140}
        className={cn('size-full object-cover', imageClassName)}
      />
    </div>
  );
}
