import type {
  HairConsultationConcern,
  HairConsultationHairLength,
  HairConsultationHairTexture,
  HairConsultationPersonalColor,
  HairConsultationSkinBrightness,
} from '@/entities/posts/api/create-hair-consultation-request';

import type { User } from './user';

export type UserModelInfo = {
  hairLength?: HairConsultationHairLength | null;
  hairConcerns?: HairConsultationConcern[] | null;
  hairTexture?: HairConsultationHairTexture | null;
  skinBrightness?: HairConsultationSkinBrightness | null;
  personalColor?: HairConsultationPersonalColor | null;
};

export type UserDetail = User & {
  modelInfo?: UserModelInfo | null;
  designerInfo?: Record<string, unknown> | null;
};
