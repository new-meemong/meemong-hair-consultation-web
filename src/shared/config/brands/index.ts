import { type BrandConfig, BrandConfigSchema } from '@/shared/config/brand-config';

import { amtonConfig } from './amton';
import { ALLOWED_BRAND_SLUGS } from './allowed-slugs';
import { hasBrandCode } from './brand-code';
import { meemongConfig } from './meemong';
import { twentySixDoHairConfig } from './26do-hair';
import { visualSalonConfig } from './visual-salon';
import { vogConfig } from './vog';

export const brandRegistry = {
  meemong: meemongConfig,
  // parkjun: parkjunConfig,
  vog: vogConfig,
  'visual-salon': visualSalonConfig,
  '26do-hair': twentySixDoHairConfig,
  amton: amtonConfig,
} as const;

export type BrandSlug = keyof typeof brandRegistry;

// 예약 슬러그 — 기술적 충돌 또는 URL 혼란 방지 목적
// 브랜드 등록 시 이 목록과 충돌하지 않는지 아래 startupValidation에서 자동 검증
const RESERVED_SLUGS = ['api', 'posts', 'chat', 'report', 'welcome', 'login', 'signup'] as const;

// 서버 기동 시점 1회 실행 — 브랜드 설정 일관성 검증
const registryKeys = Object.keys(brandRegistry);

// 1) registry와 allowed-slugs 동기화 검증 — 한쪽만 추가하면 즉시 오류
const inRegistryOnly = registryKeys.filter((k) => !ALLOWED_BRAND_SLUGS.has(k));
const inAllowedOnly = [...ALLOWED_BRAND_SLUGS].filter((k) => !Object.hasOwn(brandRegistry, k));
if (inRegistryOnly.length > 0 || inAllowedOnly.length > 0) {
  throw new Error(
    `[BrandRegistry] allowed-slugs.ts와 brandRegistry가 불일치합니다. ` +
      `registry에만 있음: [${inRegistryOnly.join(', ')}], ` +
      `allowed-slugs에만 있음: [${inAllowedOnly.join(', ')}]`,
  );
}

// 2) 예약 슬러그 충돌 검증
const reservedConflicts = registryKeys.filter((slug) =>
  (RESERVED_SLUGS as readonly string[]).includes(slug),
);
if (reservedConflicts.length > 0) {
  throw new Error(
    `[BrandRegistry] 예약 슬러그와 충돌하는 브랜드가 등록됨: ${reservedConflicts.join(', ')}`,
  );
}

// 3) 브랜드 코드 미설정 검증
// null은 meemong의 ALL 타입이므로 허용하고, 빈 문자열은 배포 설정 누락으로 간주
const unconfiguredBrandCodeSlugs = Object.entries(brandRegistry)
  .filter(([, config]) => config.brandCode !== null && !hasBrandCode(config.brandCode))
  .map(([slug]) => slug);
if (unconfiguredBrandCodeSlugs.length > 0) {
  throw new Error(
    `[BrandRegistry] 브랜드 코드가 설정되지 않은 브랜드가 등록됨: ${unconfiguredBrandCodeSlugs.join(
      ', ',
    )}`,
  );
}

// Zod safeParse로 런타임 검증 — 오타/누락 필드 즉시 감지
export function getBrandConfig(slug: string | undefined | null): BrandConfig | null {
  if (!slug || !Object.hasOwn(brandRegistry, slug)) return null;

  const config = brandRegistry[slug as BrandSlug];
  const result = BrandConfigSchema.safeParse(config);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Invalid brand config for slug: "${slug}"`, result.error.flatten());
    }
    return null;
  }

  return result.data;
}

// 컨설팅 생성 API 호출 시 브랜드별 파라미터 변환
// brandId: GET /api/v1/brands/code 로 조회한 브랜드 ID (null = ALL 타입)
export function getBrandSelectionPayload(brandId: number | null) {
  if (brandId === null) {
    return { brandSelectionType: 'ALL' as const };
  }
  return {
    brandSelectionType: 'BRAND' as const,
    brandIds: [brandId],
  };
}
