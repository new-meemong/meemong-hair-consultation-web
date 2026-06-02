import { type BrandConfig } from '@/shared/config/brand-config';
import amtonLogoLarge from '@/assets/brand/logos/logo_amton_large.png';
import amtonLogoSmall from '@/assets/brand/logos/logo_amton_small.png';

export const amtonConfig: BrandConfig = {
  slug: 'amton',
  name: '에이엠톤',
  displayName: '에이엠톤 헤어컨설팅',
  brandCode: 'A1402',
  logo: { src: amtonLogoLarge, width: 160, height: 55 },
  smallLogo: { src: amtonLogoSmall },
  theme: {},
  features: { chat: false, mong: false, growthPass: false },
};
