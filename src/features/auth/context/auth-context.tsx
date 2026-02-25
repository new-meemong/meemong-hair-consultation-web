'use client';

import { useSearchParams } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { isDesigner, isModel } from '@/entities/user/lib/user-role';
import { useWebviewLogin } from '@/features/auth/api/use-webview-login';
import { AUTH_TOKEN_EXPIRED_EVENT } from '@/shared/api/client';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import {
  decodeJWTPayload,
  getCurrentUser,
  getDefaultUserData,
  setUserData,
  updateUserData,
  type UserData,
} from '@/shared/lib/auth';

type AuthContextType = {
  user: UserData;
  isUserModel: boolean;
  isUserDesigner: boolean;
  updateUser: (userData: Partial<UserData>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get(SEARCH_PARAMS.USER_ID);

  const [isInitialized, setIsInitialized] = useState(false);

  const [user, setUser] = useState<UserData | null>(() => getCurrentUser());

  const loginInFlightRef = useRef<Promise<unknown> | null>(null);
  const lastRefreshAtRef = useRef(0);
  const lastUserIdRef = useRef<string | null>(null);

  const { mutateAsync: loginAsync, isError } = useWebviewLogin({
    onSuccess: (response) => {
      const userResponseData = response.data;
      if (userResponseData.token) {
        setUserData(userResponseData);
        setUser(getDefaultUserData(userResponseData));
      }
    },
    onSettled: () => {
      setIsInitialized(true);
    },
  });

  const tokenExpiryMs = useMemo(() => {
    if (!user?.token) return null;
    const payload = decodeJWTPayload(user.token);
    return payload?.exp ? payload.exp * 1000 : null;
  }, [user?.token]);

  const shouldRefreshToken = useMemo(() => {
    if (!user?.token) return false;
    if (!tokenExpiryMs) return true;
    const refreshThresholdMs = 10 * 60 * 1000;
    return tokenExpiryMs - Date.now() < refreshThresholdMs;
  }, [tokenExpiryMs, user?.token]);

  const refreshToken = useCallback(
    async (_reason: string) => {
      if (!userId) return;
      if (loginInFlightRef.current) {
        await loginInFlightRef.current;
        return;
      }
      const now = Date.now();
      if (now - lastRefreshAtRef.current < 1000) return;

      loginInFlightRef.current = loginAsync({ userId }).finally(() => {
        loginInFlightRef.current = null;
        lastRefreshAtRef.current = Date.now();
      });
      await loginInFlightRef.current;
    },
    [loginAsync, userId],
  );

  const updateUser = (userData: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      updateUserData(updatedUser);
      return updatedUser;
    });
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    const hasUserIdChanged = lastUserIdRef.current !== userId;
    if (hasUserIdChanged) {
      lastUserIdRef.current = userId;
      setIsInitialized(false);
    }
    const isSameUser = user?.id === Number(userId);
    if (!isSameUser) {
      void refreshToken('user-change');
      return;
    }

    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized, refreshToken, userId, user?.id]);

  useEffect(() => {
    if (!userId || !user?.token) return;
    if (!shouldRefreshToken) return;
    void refreshToken('initial-refresh');
  }, [refreshToken, shouldRefreshToken, user?.token, userId]);

  useEffect(() => {
    if (!userId) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && shouldRefreshToken) {
        void refreshToken('visibility');
      }
    };
    const handleFocus = () => {
      if (shouldRefreshToken) {
        void refreshToken('focus');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshToken, shouldRefreshToken, userId]);

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(
      () => {
        if (shouldRefreshToken) {
          void refreshToken('interval');
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [refreshToken, shouldRefreshToken, userId]);

  useEffect(() => {
    if (!userId) return;
    const handleTokenExpired = () => {
      void refreshToken('403-token-expired');
    };
    window.addEventListener(AUTH_TOKEN_EXPIRED_EVENT, handleTokenExpired);
    return () => window.removeEventListener(AUTH_TOKEN_EXPIRED_EVENT, handleTokenExpired);
  }, [userId, refreshToken]);

  if (userId === null) return <div>유저아이디가 누락되었습니다</div>;

  const isSameUser = user?.id === Number(userId);

  if (!user || !isInitialized || !isSameUser) {
    return isError ? <div>로그인 실패</div> : null;
  }

  const isUserModel = isModel(user);
  const isUserDesigner = isDesigner(user);

  return (
    <AuthContext.Provider value={{ user, isUserModel, isUserDesigner, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
