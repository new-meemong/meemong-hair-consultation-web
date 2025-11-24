'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';


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

  const { mutate: login, isError } = useWebviewLogin({
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

  const updateUser = (userData: Partial<UserData>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      updateUserData(updatedUser);
      return updatedUser;
    });
  };

  useEffect(() => {
    if (isInitialized) return;

    const isSameUser = user?.id === Number(userId);
    if (isSameUser) {
      setIsInitialized(true);
      return;
    }

    if (!userId) {
      return;
    }

    login({ userId });
  }, [login, isInitialized, userId, user?.id]);

  if (userId === null) return <div>유저아이디가 누락되었습니다</div>;

  if (!user || !isInitialized) return null;

  const isUserModel = isModel(user);
  const isUserDesigner = isDesigner(user);

  return (
    <AuthContext.Provider value={{ user, isUserModel, isUserDesigner, updateUser }}>
      {isError ? <div>로그인 실패</div> : children}
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
