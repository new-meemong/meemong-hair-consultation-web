import type { User } from '@/entities/user/model/user';
import type { UserWritingContent } from '@/features/posts/types/user-writing-content';
import { USER_WRITING_CONTENT_KEYS, type USER_GUIDE_KEYS } from '@/shared/constants/local-storage';

export interface JWTPayload {
  userId: number;
  exp: number;
}

export interface UserGuideState {
  [USER_GUIDE_KEYS.hasSeenCreatePostGuide]: boolean;
  [USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide]: boolean;
}

export type UserData = User & UserGuideState & UserWritingContent;

const USER_DATA_KEY = 'user_data';

export const decodeJWTPayload = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 토큰 디코딩 실패:', error);
    return null;
  }
};

export const getDefaultUserData = (user: User): UserData => {
  return {
    ...user,
    hasSeenCreatePostGuide: false,
    hasSeenDesignerOnboardingGuide: false,
    [USER_WRITING_CONTENT_KEYS.consultingPost]: null,
    [USER_WRITING_CONTENT_KEYS.consultingResponse]: [],
  };
};

export const setUserData = (user: User): void => {
  if (typeof window === 'undefined') return;

  const userData: UserData = getDefaultUserData(user);

  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const getCurrentUser = (): UserData | null => {
  if (typeof window === 'undefined') return null;

  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;

  try {
    const parsedData = JSON.parse(userData);
    return parsedData;
  } catch (error) {
    console.error('User data 파싱 실패:', error);
    return null;
  }
};

export const updateUserData = (userData: Partial<UserData>): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const updatedUser = { ...currentUser, ...userData };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
};

export const getToken = (): string | null => {
  const user = getCurrentUser();
  return user?.token || null;
};

export const removeUserData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_DATA_KEY);
};

export const logout = (): void => {
  removeUserData();
  // TODO : 서버 로그아웃 요청 필요한지 확인
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
