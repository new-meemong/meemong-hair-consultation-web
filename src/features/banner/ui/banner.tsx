import Image from 'next/image';

import type { Banner } from '@/entities/banner/model/banner';

import openUrlInApp from '@/shared/lib/open-url-in-app';

type BannerProps = {
  banner: Banner;
};

export default function Banner({ banner }: BannerProps) {
  const handleClick = () => {
    openUrlInApp(banner.redirectUrl);
  };

  return (
    <Image
      src={banner.imageUrl}
      alt={banner.bannerType}
      className="object-contain"
      width={0}
      height={0}
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
        boxShadow: '0 2px 2px 2px rgba(0, 0, 0, 0.2)',
      }}
      onClick={handleClick}
    />
  );
}
