import { type BrandConfig } from '@/shared/config/brand-config';
import parkjunLogoLarge from '@/assets/brand/logos/logo_parkjun_large.png';
import parkjunLogoSmall from '@/assets/brand/logos/logo_parkjun_small.png';

export const parkjunConfig: BrandConfig = {
  slug: 'parkjun',
  name: '박준뷰티랩',
  displayName: '박준 뷰티랩',
  apiBrandId: 1, // BRAND 타입 — brandIds: [1]
  logo: { src: parkjunLogoLarge, width: 120, height: 96 },
  smallLogo: { src: parkjunLogoSmall },
  theme: { colorCautionary: '#C8A97E' },
  features: { chat: false, mong: false, growthPass: false },
};
