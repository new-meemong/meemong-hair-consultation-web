import { useCallback } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import type { UserWritingContent } from '@/features/posts/types/user-writing-content';

import type { KeyOf } from '../type/types';

export default function useWritingContent(key: KeyOf<UserWritingContent>) {
  const { user, updateUser } = useAuthContext();

  const getSavedContent = useCallback(() => {
    return user[key];
  }, [user, key]);

  const saveContent = useCallback(
    (content: UserWritingContent[keyof UserWritingContent]) => {
      updateUser({ [key]: content });
    },
    [key, updateUser],
  );

  return { getSavedContent, saveContent };
}
