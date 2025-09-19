import type { ValueOf } from '@/shared/type/types';

import { USER_ROLE } from '../constants/user-role';

// TODO: job-web의 UserType과 차이 있음, 추후 확인 필요
export interface User {
  id: number;
  email: string;
  ProfilePictureURL?: string | null;
  profilePictureURL: string | null;
  accessToken: string | null;
  socialCode: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  loginSession: string;
  role: ValueOf<typeof USER_ROLE>;
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
}
