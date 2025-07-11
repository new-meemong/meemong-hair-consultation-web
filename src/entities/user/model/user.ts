export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  role: number;
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
