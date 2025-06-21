export interface JWTPayload {
  userId: number;
  exp: number;
}

const TOKEN_STORAGE_KEY = 'jwt_token';
const TOKEN_REFRESH_KEY = 'refresh_token';

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_REFRESH_KEY);
  }
};

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

export const logout = (): void => {
  removeAuthToken();
  // TODO : 서버 로그아웃 요청 필요한지 확인
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
