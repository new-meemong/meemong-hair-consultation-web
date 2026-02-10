import { USER_GUIDE_KEYS, USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';

import type { SelectedRegion } from '@/features/region/types/selected-region';
import type { User } from '@/entities/user/model/user';
import type { UserWritingContent } from '@/features/posts/types/user-writing-content';

export interface JWTPayload {
  userId: number;
  exp: number;
}

export interface UserGuideData {
  [USER_GUIDE_KEYS.hasSeenCreatePostGuide]: boolean;
  [USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide]: boolean;
  [USER_GUIDE_KEYS.hasSeenConsultingResponseSidebarGuide]: boolean;
  [USER_GUIDE_KEYS.hasSeenHairConsultationOnboardingModel]: boolean;
  [USER_GUIDE_KEYS.hasSeenHairConsultationOnboardingDesigner]: boolean;
}

export type UserData = User & UserWritingContent;

const USER_DATA_KEY = 'user_data';
const USER_GUIDE_DATA_KEY_PREFIX = 'user_guide_data_';
const USER_SELECTED_REGION_DATA_KEY_PREFIX = 'user_selected_region_data_';

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
    [USER_WRITING_CONTENT_KEYS.consultingPost]: null,
    [USER_WRITING_CONTENT_KEYS.hairConsultation]: null,
    [USER_WRITING_CONTENT_KEYS.consultingResponse]: [],
    [USER_WRITING_CONTENT_KEYS.experienceGroup]: null,
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

const getUserGuideDataKey = (): string => {
  const currentUser = getCurrentUser();
  if (!currentUser) return '';

  return `${USER_GUIDE_DATA_KEY_PREFIX}${currentUser.id}`;
};

const getDefaultUserGuideData = (): UserGuideData => {
  return {
    [USER_GUIDE_KEYS.hasSeenCreatePostGuide]: false,
    [USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide]: false,
    [USER_GUIDE_KEYS.hasSeenConsultingResponseSidebarGuide]: false,
    [USER_GUIDE_KEYS.hasSeenHairConsultationOnboardingModel]: false,
    [USER_GUIDE_KEYS.hasSeenHairConsultationOnboardingDesigner]: false,
  };
};

export const getUserGuideData = (): UserGuideData => {
  if (typeof window === 'undefined') return getDefaultUserGuideData();

  const userGuideDataKey = getUserGuideDataKey();

  const userGuideData = localStorage.getItem(userGuideDataKey);
  if (!userGuideData) return getDefaultUserGuideData();
  return JSON.parse(userGuideData);
};

export const updateUserGuideData = (userGuideData: Partial<UserGuideData>): void => {
  const userGuideDataKey = getUserGuideDataKey();

  const currentUserGuideData = getUserGuideData() ?? getDefaultUserGuideData();

  const updatedUserGuideData = { ...currentUserGuideData, ...userGuideData };

  localStorage.setItem(userGuideDataKey, JSON.stringify(updatedUserGuideData));
};

const getUserSelectedRegionDataKey = (): string => {
  const currentUser = getCurrentUser();
  if (!currentUser) return '';

  return `${USER_SELECTED_REGION_DATA_KEY_PREFIX}${currentUser.id}`;
};

export const getUserSelectedRegionData = (): SelectedRegion | null => {
  if (typeof window === 'undefined') return null;

  const userSelectedRegionDataKey = getUserSelectedRegionDataKey();
  const userSelectedRegionData = localStorage.getItem(userSelectedRegionDataKey);

  if (!userSelectedRegionData) return null;

  return JSON.parse(userSelectedRegionData);
};

export const updateUserSelectedRegionData = (selectedRegion: SelectedRegion | null): void => {
  const userSelectedRegionDataKey = getUserSelectedRegionDataKey();
  localStorage.setItem(userSelectedRegionDataKey, JSON.stringify(selectedRegion));
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
