import { type BrandConfig } from '@/shared/config/brand-config';
import meemongLogoLarge from '@/assets/brand/logos/logo_meemong_large.png';
import meemongLogoSmall from '@/assets/brand/logos/logo_meemong_small.png';

export const meemongConfig: BrandConfig = {
  slug: 'meemong',
  name: '미몽',
  displayName: '미몽 헤어컨설팅',
  brandCode: null, // null = ALL 타입 — 모든 브랜드 컨설팅 조회
  logo: { src: meemongLogoLarge, width: 160, height: 37 },
  smallLogo: { src: meemongLogoSmall },
  theme: { colorCautionary: '#C8A97E' },
  features: { chat: true, mong: true, growthPass: true },
};
