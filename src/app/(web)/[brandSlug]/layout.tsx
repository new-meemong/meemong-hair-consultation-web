import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';

import { type BrandConfig } from '@/shared/config/brand-config';
import { brandRegistry, getBrandConfig } from '@/shared/config/brands';
import { BrandProvider } from '@/shared/context/brand-context';

function buildThemeVars(theme: BrandConfig['theme']): React.CSSProperties {
  return {
    ...(theme.colorCautionary && { '--color-cautionary': theme.colorCautionary }),
  } as React.CSSProperties;
}

export default async function WebBrandLayout({
  params,
  children,
}: {
  params: Promise<{ brandSlug: string }>;
  children: ReactNode;
}) {
  const { brandSlug } = await params;

  // 개발 환경에서 brand_override 쿠키가 있으면 해당 브랜드로 처리
  const devOverride =
    process.env.NODE_ENV === 'development' ? (await cookies()).get('brand_override')?.value : null;

  const slug = devOverride ?? brandSlug;
  const brand = getBrandConfig(slug);
  if (!brand) notFound();

  // CSS 변수를 wrapper div에 인라인 주입 — SSR에서 바로 적용되므로 플리커 없음
  // className="contents"로 wrapper가 레이아웃에 영향을 주지 않음
  return (
    <div style={buildThemeVars(brand.theme)} className="contents">
      <BrandProvider initialBrand={brand}>
        <Suspense fallback={null}>{children}</Suspense>
      </BrandProvider>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(brandRegistry).map((slug) => ({ brandSlug: slug }));
}
