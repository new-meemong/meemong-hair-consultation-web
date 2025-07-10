// 사용자 엔티티 타입
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

// API 요청/응답 타입
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
