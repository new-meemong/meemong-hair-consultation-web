'use client';

import Image from 'next/image';

import { useBrand } from '@/shared/context/brand-context';

// layout에서 BrandProvider가 dev override를 반영한 brand를 주입하므로
// 여기서 getBrandConfig를 별도 호출하지 않음 (테마/로고/브랜드명 일치 보장)
export default function BrandWelcomePage() {
  const { config: brand } = useBrand();

  return (
    <div className="relative flex h-full min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center pb-56">
        <Image
          src={brand.logo.src}
          width={brand.logo.width}
          height={brand.logo.height}
          alt={brand.name}
          priority
        />
        <div className="my-4 h-0.5 w-5 bg-border-default" />
        <p className="typo-body-1-regular text-label-info">{brand.displayName}</p>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 px-5 pb-8">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-[4px] border border-border-default bg-white px-5 py-4 typo-body-1-medium text-label-default"
          >
            샘플보기
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-[4px] border border-border-default bg-white px-5 py-4 typo-body-1-medium text-label-default"
          >
            내 컨설팅 목록
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-[4px] bg-cautionary px-5 py-4 typo-body-1-medium text-white"
          >
            컨설팅 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
