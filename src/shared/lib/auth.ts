import { User } from '@/entities/user/model/user';

export interface JWTPayload {
  userId: number;
  exp: number;
}

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

export const setUserData = (user: User): void => {
  if (typeof window === 'undefined') return;

  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
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
