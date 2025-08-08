'use client';

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { isDesigner, isModel } from '@/entities/user/lib/user-role';
import { useWebviewLogin } from '@/features/auth/api/use-webview-login';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import {
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

  const { mutate: login } = useWebviewLogin({
    onSuccess: (response) => {
      const userResponseData = response.data;
      if (userResponseData.token) {
        setUserData(userResponseData);
        setUser(getDefaultUserData(userResponseData));
      }
    },
  });

  const updateUser = (userData: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      updateUserData(updatedUser);
      return updatedUser;
    });
  };

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
