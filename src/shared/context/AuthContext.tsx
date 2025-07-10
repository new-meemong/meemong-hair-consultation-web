'use client';

import { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { useWebviewLogin } from '@/features/auth/api/useWebviewLogin';
import { getAuthTokenData, setAuthTokenData } from '@/shared/lib/auth';
import { useSearchParams } from 'next/navigation';

type AuthContextType = Record<string, unknown>;

const AuthContext = createContext<AuthContextType | null>(null);

const USER_ID_KEY = 'userId';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { mutate: login } = useWebviewLogin({
    onSuccess: (response) => {
      const token = response.data.token;
      if (token) {
        setAuthTokenData(token);
      }
    },
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get(USER_ID_KEY);

  useEffect(() => {
    const authTokenData = getAuthTokenData();
    const isSameUser = authTokenData?.userId === Number(userId);
    if (isSameUser) {
      setIsInitialized(true);
      return;
    }

    if (!userId) return;

    login({ userId });
    setIsInitialized(true);
  }, [login, isInitialized, userId]);

  return <AuthContext.Provider value={{}}>{isInitialized && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
