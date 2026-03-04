'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useCallback } from 'react';

const createUrlWithUserId = (
  path: string,
  userId: string | null,
  source: string | null,
  params?: Record<string, string>,
) => {
  const url = new URL(path, window.location.origin);

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

  const push = useCallback(
    (path: string, params?: Record<string, string>) => {
      router.push(createUrlWithUserId(path, userId, source, params));
    },
    [router, userId, source],
  );

  const replace = useCallback(
    (path: string, params?: Record<string, string>) => {
      router.replace(createUrlWithUserId(path, userId, source, params));
    },
    [router, userId, source],
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
