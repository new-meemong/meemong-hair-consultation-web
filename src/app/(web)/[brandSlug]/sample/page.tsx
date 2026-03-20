'use client';

import Image from 'next/image';
import { SiteHeader } from '@/widgets/header/ui/site-header';
import sample1 from '@/assets/welcome/sample/welcome_sample1.png';
import sample2 from '@/assets/welcome/sample/welcome_sample2.png';
import sampleProfile from '@/assets/welcome/sample/welcome_sample_profile.png';
import { useBrand } from '@/shared/context/brand-context';
import { useRouter } from 'next/navigation';

export default function BrandSamplePage() {
  const { config: brand } = useBrand();
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader title="컨설팅 답변" showBackButton onBackClick={() => router.back()} />

      <div className="flex-1 overflow-y-auto">
        {/* 프로필 영역 */}
        <div
          className="relative shrink-0 bg-label-default"
          style={{ height: 260, padding: '32px 20px' }}
        >
          {/* 브랜드 로고 - 우측 상단 */}
          <div className="absolute top-8 right-5 size-[63px] rounded-[6px] border border-border-default bg-white flex items-center justify-center overflow-hidden">
            <Image
              src={brand.smallLogo.src}
              width={63}
              height={63}
              alt={brand.name}
              className="object-contain"
            />
          </div>

          {/* 하단 프로필 이미지 + 문구 */}
          <div className="absolute bottom-8 left-5">
            <Image
              src={sampleProfile}
              width={48}
              height={48}
              alt="샘플 프로필"
              className="rounded-full object-cover"
            />
            <p className="mt-4 typo-title-3-semibold text-white whitespace-pre-line">
              {`${brand.name} 디자이너가 보낸\n컨설팅 답변입니다`}
            </p>
          </div>
        </div>

        {/* 분석결과 이미지 */}
        <Image src={sample1} alt="컨설팅 분석 결과 샘플" className="w-full" />

        {/* 디바이더 */}
        <div className="h-1.5 w-full bg-alternative" />

        {/* 추천시술 이미지 */}
        <Image src={sample2} alt="추천 시술 샘플" className="w-full" />

        {/* 푸터 */}
        <div className="h-[60px]" />
      </div>
    </div>
  );
}
