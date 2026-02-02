import type {
  HairConsultationConcern,
  HairConsultationHairLength,
  HairConsultationHairTexture,
  HairConsultationPersonalColor,
  HairConsultationSkinBrightness,
} from '@/entities/posts/api/create-hair-consultation-request';

import { USER_ROLE } from '../constants/user-role';
import type { ValueOf } from '@/shared/type/types';

// TODO: job-web의 UserType과 차이 있음, 추후 확인 필요
export interface User {
  id: number;
  email: string;
  profilePictureURL: string | null;
  profileUrl?: string;
  accessToken: string | null;
  socialCode: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  loginSession: string;
  role: ValueOf<typeof USER_ROLE>;
  Role?: ValueOf<typeof USER_ROLE>;
  loginType: string;
  fcmToken: string | null;
  sex: string;
  korean: string;
  phone: string;
  recentLoginTime: string | null;
  recentRealLoginTime: string | null;
  lastViewDesignerViewDateTime: string | null;
  cacheProfilePictureURL: string | null;
  lastLoginAt: string | null;
  premiumThunderAnnouncementRemainingCount: number;
  isExistPassword: boolean;
  appIdentifierId: string | null;
  token: string;
  DisplayName?: string;
  hairLength?: HairConsultationHairLength | null;
  hairConcerns?: HairConsultationConcern[] | null;
  hairTexture?: HairConsultationHairTexture | null;
  skinBrightness?: HairConsultationSkinBrightness | null;
  personalColor?: HairConsultationPersonalColor | null;
}
