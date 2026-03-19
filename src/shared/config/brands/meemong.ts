import { type BrandConfig } from '@/shared/config/brand-config';
import meemongLogoLarge from '@/assets/brand/logos/logo_meemong_large.png';

export const meemongConfig: BrandConfig = {
  slug: 'meemong',
  name: '미몽',
  displayName: '미몽 헤어컨설팅',
  apiBrandId: null, // ALL 타입 — 모든 브랜드 컨설팅 조회
  logo: { src: meemongLogoLarge, width: 160, height: 37 },
  theme: {}, // 기본 테마 사용 (globals.css 정의값)
  features: { chat: true, mong: true, growthPass: true },
};
