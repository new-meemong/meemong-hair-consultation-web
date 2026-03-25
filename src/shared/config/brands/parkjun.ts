import { type BrandConfig } from '@/shared/config/brand-config';
import parkjunLogoLarge from '@/assets/brand/logos/logo_parkjun_large.png';
import parkjunLogoSmall from '@/assets/brand/logos/logo_parkjun_small.png';

export const parkjunConfig: BrandConfig = {
  slug: 'parkjun',
  name: '박준뷰티랩',
  displayName: '박준 뷰티랩',
  brandCode: 'P4599', // GET /api/v1/brands/code 로 brandId를 동적 조회
  logo: { src: parkjunLogoLarge, width: 120, height: 96 },
  smallLogo: { src: parkjunLogoSmall },
  theme: {}, // 기본 테마 사용 (globals.css 정의값)
  features: { chat: false, mong: false, growthPass: false },
};
