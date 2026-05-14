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

import { getMyBrand } from '@/entities/brands/api/get-my-brand';
import type { MyBrand } from '@/entities/brands/model/my-brand';
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

const DESIGNER_BRAND_SYNC_THROTTLE_MS = 5 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get(SEARCH_PARAMS.USER_ID);

  const [isInitialized, setIsInitialized] = useState(false);

  const [user, setUser] = useState<UserData | null>(() => getCurrentUser());
  const [completedInitialDesignerBrandSyncUserId, setCompletedInitialDesignerBrandSyncUserId] =
    useState<string | null>(null);

  const loginInFlightRef = useRef<Promise<unknown> | null>(null);
  const brandSyncInFlightRef = useRef<Promise<void> | null>(null);
  const lastRefreshAtRef = useRef(0);
  const lastUserIdRef = useRef<string | null>(null);
  const lastDesignerBrandSyncStartedAtRef = useRef(0);
  const currentUserRef = useRef<UserData | null>(user);
  currentUserRef.current = user;

  const { mutateAsync: loginAsync, isError } = useWebviewLogin({
    onSuccess: (response) => {
      const userResponseData = response.data;
      if (userResponseData.token) {
        setUserData(userResponseData);
        setUser(getDefaultUserData(userResponseData));

        if (
          userId &&
          userResponseData.id === Number(userId) &&
          isDesigner(userResponseData) &&
          userResponseData.brand !== undefined
        ) {
          setCompletedInitialDesignerBrandSyncUserId(userId);
        }
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

  const isTokenLoaded = Boolean(user?.token);

  const isBrandLoaded = useMemo(
    () => user?.brand !== undefined || user?.brandLookupFailed === true,
    [user?.brand, user?.brandLookupFailed],
  );

  const shouldSyncDesignerBrand =
    user != null && Boolean(user.token) && isDesigner(user) && isBrandLoaded;

  // 브랜드 코드는 네이티브 앱에서 변경될 수 있어 캐시된 brand:null을 최종값으로 보지 않는다.
  const shouldBlockForMissingDesignerBrand =
    user != null &&
    shouldSyncDesignerBrand &&
    (user.brand === null || user.brandLookupFailed === true);

  const isSameUser = userId !== null && user?.id === Number(userId);

  const shouldBlockInitialDesignerBrandSync =
    userId !== null &&
    isBrandLoaded &&
    isTokenLoaded &&
    shouldBlockForMissingDesignerBrand &&
    completedInitialDesignerBrandSyncUserId !== userId;

  const refreshToken = useCallback(
    async (reason: string) => {
      if (!userId) return;
      if (loginInFlightRef.current) {
        await loginInFlightRef.current;
        return;
      }
      const now = Date.now();
      if (now - lastRefreshAtRef.current < 1000) return;

      if (process.env.NODE_ENV === 'development') {
        console.debug('[AuthProvider] refreshToken:', reason);
      }

      loginInFlightRef.current = loginAsync({ userId }).finally(() => {
        loginInFlightRef.current = null;
        lastRefreshAtRef.current = Date.now();
      });
      await loginInFlightRef.current;
    },
    [loginAsync, userId],
  );

  const updateDesignerBrandLookup = useCallback(
    (expectedUserId: number, data: { brand?: MyBrand | null; brandLookupFailed: boolean }) => {
      setUser((prev) => {
        if (!prev || prev.id !== expectedUserId) return prev;

        const updatedUser: UserData = {
          ...prev,
          brandLookupFailed: data.brandLookupFailed,
        };
        if ('brand' in data) {
          updatedUser.brand = data.brand;
        }

        updateUserData(updatedUser);
        return updatedUser;
      });
    },
    [],
  );

  const syncDesignerBrand = useCallback(
    async (reason: string, options: { markInitialComplete?: boolean } = {}) => {
      const currentUser = currentUserRef.current;
      if (!userId || !currentUser || !isDesigner(currentUser)) return;

      const expectedUserId = Number(userId);
      if (currentUser.id !== expectedUserId || !currentUser.token) return;

      if (brandSyncInFlightRef.current) {
        try {
          await brandSyncInFlightRef.current;
        } finally {
          if (options.markInitialComplete) {
            setCompletedInitialDesignerBrandSyncUserId(userId);
          }
        }
        return;
      }

      const now = Date.now();
      if (now - lastDesignerBrandSyncStartedAtRef.current < DESIGNER_BRAND_SYNC_THROTTLE_MS) {
        if (options.markInitialComplete) {
          setCompletedInitialDesignerBrandSyncUserId(userId);
        }
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.debug('[AuthProvider] syncDesignerBrand:', reason);
      }

      lastDesignerBrandSyncStartedAtRef.current = now;

      brandSyncInFlightRef.current = getMyBrand(currentUser.token)
        .then((brand) => {
          updateDesignerBrandLookup(expectedUserId, { brand, brandLookupFailed: false });
        })
        .catch((error) => {
          console.error('내 브랜드 재조회 실패:', error);
          updateDesignerBrandLookup(expectedUserId, { brandLookupFailed: true });
        })
        .finally(() => {
          brandSyncInFlightRef.current = null;
          if (options.markInitialComplete) {
            setCompletedInitialDesignerBrandSyncUserId(userId);
          }
        });

      await brandSyncInFlightRef.current;
    },
    [updateDesignerBrandLookup, userId],
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
      setCompletedInitialDesignerBrandSyncUserId(null);
    }

    if (!isSameUser || !isTokenLoaded || !isBrandLoaded) {
      const reason = !isSameUser
        ? 'user-change'
        : !isTokenLoaded
          ? 'token-missing'
          : 'brand-missing';
      void refreshToken(reason);
      return;
    }

    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isBrandLoaded, isInitialized, isSameUser, isTokenLoaded, refreshToken, userId]);

  useEffect(() => {
    if (!userId || !user?.token) return;
    if (!shouldRefreshToken) return;
    void refreshToken('initial-refresh');
  }, [refreshToken, shouldRefreshToken, user?.token, userId]);

  useEffect(() => {
    if (!userId || !shouldSyncDesignerBrand) return;
    if (completedInitialDesignerBrandSyncUserId === userId) return;
    void syncDesignerBrand('initial-designer-brand-sync', { markInitialComplete: true });
  }, [completedInitialDesignerBrandSyncUserId, shouldSyncDesignerBrand, syncDesignerBrand, userId]);

  useEffect(() => {
    if (!userId) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (shouldRefreshToken) {
          void refreshToken('visibility');
          return;
        }

        void syncDesignerBrand('visibility-designer-brand-sync');
      }
    };
    const handleFocus = () => {
      if (shouldRefreshToken) {
        void refreshToken('focus');
        return;
      }

      void syncDesignerBrand('focus-designer-brand-sync');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshToken, shouldRefreshToken, syncDesignerBrand, userId]);

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

  if (
    !user ||
    !isInitialized ||
    !isSameUser ||
    !isTokenLoaded ||
    !isBrandLoaded ||
    shouldBlockInitialDesignerBrandSync
  ) {
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

// (webview) 레이아웃 밖에서도 안전하게 호출 가능 — null이면 web 컨텍스트(비인증)
export function useOptionalAuthContext(): AuthContextType | null {
  return useContext(AuthContext);
}
