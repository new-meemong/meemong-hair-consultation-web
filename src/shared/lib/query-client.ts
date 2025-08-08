import { QueryClient } from '@tanstack/react-query';

import { getErrorMessage, getFieldErrors } from './error-handler';

function handleGlobalMutationError(error: unknown): void {
  const message = getErrorMessage(error);
  const fieldErrors = getFieldErrors(error);
  console.warn('API 에러:', message);

  if (fieldErrors.length > 0) {
    fieldErrors.forEach((fieldError) => {
      console.warn('필드 오류:', fieldError);
    });
  }

  // TODO: 필요시 토스트나 모달 알림 추가
  // toast.error(message);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
      retry: (failureCount: number, error: unknown) => {
        // 4xx 에러는 재시도하지 않음
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: handleGlobalMutationError,
    },
  },
});
