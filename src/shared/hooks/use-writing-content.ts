import { useCallback } from 'react';

import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import type { UserWritingContent } from '@/features/posts/types/user-writing-content';

import type { KeyOf } from '../type/types';

const WEB_WRITING_CONTENT_PREFIX = 'web_writing_content_';

export default function useWritingContent<K extends KeyOf<UserWritingContent>>(key: K) {
  const auth = useOptionalAuthContext();

  const getSavedContent = useCallback((): UserWritingContent[K] => {
    if (auth?.user) return auth.user[key];
    // 웹 브랜드 컨텍스트 (auth 없음): localStorage 직접 사용
    if (typeof window === 'undefined') return null as UserWritingContent[K];
    const raw = localStorage.getItem(`${WEB_WRITING_CONTENT_PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as UserWritingContent[K]) : (null as UserWritingContent[K]);
  }, [auth?.user, key]);

  const saveContent = useCallback(
    (content: UserWritingContent[K] | null) => {
      if (auth?.updateUser) {
        auth.updateUser({ [key]: content });
      } else {
        // 웹 브랜드 컨텍스트 (auth 없음): localStorage 직접 사용
        if (content === null) {
          localStorage.removeItem(`${WEB_WRITING_CONTENT_PREFIX}${key}`);
        } else {
          localStorage.setItem(`${WEB_WRITING_CONTENT_PREFIX}${key}`, JSON.stringify(content));
        }
      }
    },
    [key, auth?.updateUser, auth],
  );

  const savedContent = getSavedContent();

  return { saveContent, savedContent };
}
