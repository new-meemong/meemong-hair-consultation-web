import { type BrandConfig } from '@/shared/config/brand-config';
import twentySixDoHairLogoLarge from '@/assets/brand/logos/logo_26do_hair_large.png';
import twentySixDoHairLogoSmall from '@/assets/brand/logos/logo_26do_hair_small.png';

export const twentySixDoHairConfig: BrandConfig = {
  slug: '26do-hair',
  name: '26도헤어',
  displayName: '26도헤어 헤어컨설팅',
  brandCode: 'T0710',
  logo: { src: twentySixDoHairLogoLarge, width: 120, height: 110 },
  smallLogo: { src: twentySixDoHairLogoSmall },
  theme: {},
  features: { chat: false, mong: false, growthPass: false },
};
