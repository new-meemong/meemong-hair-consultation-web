'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  EXPERIENCE_GROUP_BOARD_PATH,
  isExperienceGroupBoard,
} from '@/shared/lib/experience-group-board-navigation';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useCallback, useMemo } from 'react';

const createUrlWithUserId = (
  path: string,
  userId: string | null,
  source: string | null,
  params?: Record<string, string>,
) => {
  const isExperienceBoard = isExperienceGroupBoard(
    params?.[SEARCH_PARAMS.EXPERIENCE_BOARD],
    window.location.pathname,
  );
  // 작성 완료와 브라우저 삭제 복귀도 전용 게시판으로 모은다.
  const url = new URL(
    isExperienceBoard && path === '/posts' ? EXPERIENCE_GROUP_BOARD_PATH : path,
    window.location.origin,
  );
  if (isExperienceBoard) url.searchParams.set(SEARCH_PARAMS.EXPERIENCE_BOARD, 'true');

  if (userId) {
    url.searchParams.set(SEARCH_PARAMS.USER_ID, userId);
  }

  if (source) {
    url.searchParams.set(SEARCH_PARAMS.SOURCE, source);
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return `${url.pathname}${url.search}${url.hash}`;
};

export function useRouterWithUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get(SEARCH_PARAMS.USER_ID);
  const source = searchParams.get(SEARCH_PARAMS.SOURCE);
  const supportsFullWebviewPostCreate = searchParams.get(
    SEARCH_PARAMS.SUPPORTS_FULL_WEBVIEW_POST_CREATE,
  );
  const chatEntry = searchParams.get('chatEntry');
  const experienceBoard = searchParams.get(SEARCH_PARAMS.EXPERIENCE_BOARD);
  const supportsExperienceGroupListReturn = searchParams.get(
    SEARCH_PARAMS.SUPPORTS_EXPERIENCE_GROUP_LIST_RETURN,
  );
  const persistentNavigationParams = useMemo<Record<string, string>>(() => {
    const params: Record<string, string> = {};
    if (supportsFullWebviewPostCreate != null) {
      params[SEARCH_PARAMS.SUPPORTS_FULL_WEBVIEW_POST_CREATE] = supportsFullWebviewPostCreate;
    }
    if (chatEntry != null) params.chatEntry = chatEntry;
    if (isExperienceGroupBoard(experienceBoard)) params[SEARCH_PARAMS.EXPERIENCE_BOARD] = 'true';
    if (supportsExperienceGroupListReturn != null) {
      params[SEARCH_PARAMS.SUPPORTS_EXPERIENCE_GROUP_LIST_RETURN] =
        supportsExperienceGroupListReturn;
    }
    return params;
  }, [
    supportsFullWebviewPostCreate,
    chatEntry,
    experienceBoard,
    supportsExperienceGroupListReturn,
  ]);

  const push = useCallback(
    (path: string, params?: Record<string, string>) => {
      router.push(
        createUrlWithUserId(path, userId, source, {
          ...persistentNavigationParams,
          ...params,
        }),
      );
    },
    [router, userId, source, persistentNavigationParams],
  );

  const replace = useCallback(
    (path: string, params?: Record<string, string>) => {
      router.replace(
        createUrlWithUserId(path, userId, source, {
          ...persistentNavigationParams,
          ...params,
        }),
      );
    },
    [router, userId, source, persistentNavigationParams],
  );

  const back = useCallback(() => {
    router.back();
  }, [router]);

  const forward = useCallback(() => {
    router.forward();
  }, [router]);

  return {
    push,
    replace,
    back,
    forward,
    userId,
    source,
  };
}
