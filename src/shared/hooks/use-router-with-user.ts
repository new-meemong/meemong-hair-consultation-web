'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';

const createUrlWithUserId = (path: string, userId: string | null) => {
  if (!userId) return path;

  const url = new URL(path, window.location.origin);
  url.searchParams.set(SEARCH_PARAMS.USER_ID, userId);
  return url.toString();
};

export function useRouterWithUser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get(SEARCH_PARAMS.USER_ID);

  const push = useCallback(
    (path: string) => {
      router.push(createUrlWithUserId(path, userId));
    },
    [router, userId],
  );

  const replace = useCallback(
    (path: string) => {
      router.replace(createUrlWithUserId(path, userId));
    },
    [router, userId],
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
  };
}
