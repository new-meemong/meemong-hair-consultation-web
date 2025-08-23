import { useCallback } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import type { UserWritingContent } from '@/features/posts/types/user-writing-content';

import type { KeyOf } from '../type/types';

export default function useWritingContent<K extends KeyOf<UserWritingContent>>(key: K) {
  const { user, updateUser } = useAuthContext();

  const getSavedContent = useCallback((): UserWritingContent[K] => {
    return user[key];
  }, [user, key]);

  const saveContent = useCallback(
    (content: UserWritingContent[K]) => {
      updateUser({ [key]: content });
    },
    [key, updateUser],
  );

  const savedContent = getSavedContent();

  return { saveContent, savedContent };
}
