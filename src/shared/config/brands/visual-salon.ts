import { type BrandConfig } from '@/shared/config/brand-config';
import visualSalonLogoLarge from '@/assets/brand/logos/logo_visual_salon_large.png';
import visualSalonLogoSmall from '@/assets/brand/logos/logo_visual_salon_small.png';

export const visualSalonConfig: BrandConfig = {
  slug: 'visual-salon',
  name: '비주얼살롱',
  displayName: '비주얼살롱 헤어컨설팅',
  brandCode: 'V7452',
  logo: { src: visualSalonLogoLarge, width: 160, height: 90 },
  smallLogo: { src: visualSalonLogoSmall },
  theme: {},
  features: { chat: false, mong: false, growthPass: false },
};
