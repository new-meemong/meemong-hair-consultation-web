import { type BrandConfig } from '@/shared/config/brand-config';
import vogLogoLarge from '@/assets/brand/logos/logo_vog_large.png';
import vogLogoSmall from '@/assets/brand/logos/logo_vog_small.png';

export const vogConfig: BrandConfig = {
  slug: 'vog',
  name: '보그헤어',
  displayName: '보그헤어',
  brandCode: 'V2920', // GET /api/v1/brands/code 로 brandId를 동적 조회
  logo: { src: vogLogoLarge, width: 120, height: 96 },
  smallLogo: { src: vogLogoSmall },
  theme: {}, // 박준과 동일하게 기본 테마 사용 (globals.css 정의값)
  features: { chat: false, mong: false, growthPass: false },
};
