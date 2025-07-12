'use client';

import { useWebviewLogin } from '@/features/auth/api/use-webview-login';
import { getCurrentUser, getDefaultUserData, setUserData, UserData } from '@/shared/lib/auth';
import { User } from '@/entities/user/model/user';
import { useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { isDesigner, isModel } from '@/entities/user/lib/user-role';
import { USER_ID_KEY } from '@/shared/constants/search-params';

type AuthContextType = {
  user: User;
  isUserModel: boolean;
  isUserDesigner: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get(USER_ID_KEY);

  const [isInitialized, setIsInitialized] = useState(false);

  const [user, setUser] = useState<UserData | null>(() => getCurrentUser());

  const { mutate: login } = useWebviewLogin({
    onSuccess: (response) => {
      const userResponseData = response.data;
      if (userResponseData.token) {
        setUserData(userResponseData);
        setUser(getDefaultUserData(userResponseData));
      }
    },
  });

  useEffect(() => {
    const isSameUser = user?.id === Number(userId);
    if (isSameUser) {
      setIsInitialized(true);
      return;
    }

    if (!userId) {
      return;
    }

    login({ userId });
    setIsInitialized(true);
  }, [login, isInitialized, userId, user?.id]);

  if (!isInitialized || !user) {
    return null;
  }

  const isUserModel = isModel(user);
  const isUserDesigner = isDesigner(user);

  return (
    <AuthContext.Provider value={{ user, isUserModel, isUserDesigner }}>
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
