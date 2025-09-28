import Image from 'next/image';

import type { Banner } from '@/entities/banner/model/banner';

type BannerProps = {
  banner: Banner;
};

export default function Banner({ banner }: BannerProps) {
  return (
    <Image
      src={banner.imageUrl}
      alt={banner.bannerType}
      className="object-contain"
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
