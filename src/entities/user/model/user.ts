import { USER_ROLE } from '../constants/user-role';
import type { ValueOf } from '@/shared/type/types';

// TODO: job-web의 UserType과 차이 있음, 추후 확인 필요
export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  role: ValueOf<typeof USER_ROLE>;
  sex: string;
  recentLoginTime: string | null;
  recentRealLoginTime: string | null;
  lastViewDesignerViewDateTime: string | null;
  isExistPassword: boolean;
  appIdentifierId: string | null;
  token: string;
  ProfilePictureURL: string | null;
  AccessToken: string | null;
  UserID: string;
  DisplayName: string;
  LoginSession: string;
  LoginType: string;
  FcmToken: string | null;
  Korean: string;
}
