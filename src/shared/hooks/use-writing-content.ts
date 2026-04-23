import { useCallback } from 'react';

import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import type { UserWritingContent } from '@/features/posts/types/user-writing-content';

import type { KeyOf } from '../type/types';

const WEB_WRITING_CONTENT_PREFIX = 'web_writing_content_';
const volatileWritingContent = new Map<string, unknown>();

const getVolatileKey = (key: string, userId: number | null) =>
  userId == null ? `web:${key}` : `auth:${userId}:${key}`;

export default function useWritingContent<K extends KeyOf<UserWritingContent>>(key: K) {
  const auth = useOptionalAuthContext();
  const userId = auth?.user?.id ?? null;
  const storageKey = `${WEB_WRITING_CONTENT_PREFIX}${key}`;
  const volatileKey = getVolatileKey(key as string, userId);
  const updateUser = auth?.updateUser;
  const authUser = auth?.user;

  const getSavedContent = useCallback((): UserWritingContent[K] => {
    const volatileContent = volatileWritingContent.get(volatileKey);
    if (volatileContent !== undefined) return volatileContent as UserWritingContent[K];

    if (authUser) return authUser[key];

    // 웹 브랜드 컨텍스트 (auth 없음): localStorage 직접 사용
    if (typeof window === 'undefined') return null as UserWritingContent[K];
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as UserWritingContent[K]) : (null as UserWritingContent[K]);
  }, [authUser, key, storageKey, volatileKey]);

  const saveContent = useCallback(
    (content: UserWritingContent[K] | null) => {
      if (content === null) {
        volatileWritingContent.delete(volatileKey);
      } else {
        volatileWritingContent.set(volatileKey, content);
      }

      if (updateUser) {
        updateUser({ [key]: content });
      } else {
        // 웹 브랜드 컨텍스트 (auth 없음): localStorage 직접 사용
        if (content === null) {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(content));
        }
      }
    },
    [key, storageKey, updateUser, volatileKey],
  );

  const savedContent = getSavedContent();

  return { saveContent, savedContent };
}
