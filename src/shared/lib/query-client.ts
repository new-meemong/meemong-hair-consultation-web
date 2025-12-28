import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { getErrorMessage, isTokenExpiredError } from '@/shared/lib/error-handler';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { removeUserData } from '@/shared/lib/auth';
import { showGlobalErrorOnce } from '@/shared/lib/global-overlay';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const meta = (query as unknown as { meta?: Record<string, unknown> } | undefined)?.meta;
      if (meta && meta.skipGlobalError === true) return;

      const message = getErrorMessage(error);
      showGlobalErrorOnce(message);

      // 토큰 만료 에러인 경우 자동 재로그인 시도
      if (isTokenExpiredError(error)) {
        // 로컬스토리지의 유저 데이터를 삭제하여 강제로 재로그인하도록 함
        if (typeof window !== 'undefined') {
          const currentUser = localStorage.getItem('user_data');
          if (currentUser) {
            try {
              const user = JSON.parse(currentUser);
              const userId = user?.id;
              if (userId) {
                // 유저 데이터 삭제
                removeUserData();

                // URL에 userId가 없으면 추가하여 리로드하여 재로그인 시도
                const url = new URL(window.location.href);
                const searchParams = url.searchParams;
                if (!searchParams.has(SEARCH_PARAMS.USER_ID)) {
                  searchParams.set(SEARCH_PARAMS.USER_ID, String(userId));
                  window.location.href = `${url.pathname}?${searchParams.toString()}`;
                } else {
                  // userId가 이미 있으면 페이지 리로드만 하면 AuthProvider가 재로그인 시도
                  window.location.reload();
                }
              }
            } catch {
              // 파싱 실패 시 무시
            }
          }
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const meta = (mutation as unknown as { meta?: Record<string, unknown> } | undefined)?.meta;
      if (meta && meta.skipGlobalError === true) return;

      const message = getErrorMessage(error);
      showGlobalErrorOnce(message);

      // 토큰 만료 에러인 경우 자동 재로그인 시도
      if (isTokenExpiredError(error)) {
        // 로컬스토리지의 유저 데이터를 삭제하여 강제로 재로그인하도록 함
        if (typeof window !== 'undefined') {
          const currentUser = localStorage.getItem('user_data');
          if (currentUser) {
            try {
              const user = JSON.parse(currentUser);
              const userId = user?.id;
              if (userId) {
                // 유저 데이터 삭제
                removeUserData();

                // URL에 userId가 없으면 추가하여 리로드하여 재로그인 시도
                const url = new URL(window.location.href);
                const searchParams = url.searchParams;
                if (!searchParams.has(SEARCH_PARAMS.USER_ID)) {
                  searchParams.set(SEARCH_PARAMS.USER_ID, String(userId));
                  window.location.href = `${url.pathname}?${searchParams.toString()}`;
                } else {
                  // userId가 이미 있으면 페이지 리로드만 하면 AuthProvider가 재로그인 시도
                  window.location.reload();
                }
              }
            } catch {
              // 파싱 실패 시 무시
            }
          }
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
      retry: false,
      throwOnError: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      throwOnError: false,
      retry: false,
    },
  },
});
