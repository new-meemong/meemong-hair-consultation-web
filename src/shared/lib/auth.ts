export interface JWTPayload {
  userId: number;
  exp: number;
}

export interface AuthTokenData {
  token: string;
  userId: number;
}

const TOKEN_AUTH_DATA_KEY = 'auth_token_data';

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

export const setAuthTokenData = (token: string): void => {
  if (typeof window === 'undefined') return;

  const payload = decodeJWTPayload(token);
  if (!payload) return;

  const authData: AuthTokenData = {
    token,
    userId: payload.userId,
  };
  localStorage.setItem(TOKEN_AUTH_DATA_KEY, JSON.stringify(authData));
};

export const getAuthTokenData = (): AuthTokenData | null => {
  if (typeof window === 'undefined') return null;

  const authDataString = localStorage.getItem(TOKEN_AUTH_DATA_KEY);
  if (!authDataString) return null;

  try {
    return JSON.parse(authDataString);
  } catch (error) {
    console.error('Auth data 파싱 실패:', error);
    return null;
  }
};

export const removeAuthTokenData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_AUTH_DATA_KEY);
};

export const logout = (): void => {
  removeAuthTokenData();
  // TODO : 서버 로그아웃 요청 필요한지 확인
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
