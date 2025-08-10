import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { getErrorMessage } from '@/shared/lib/error-handler';
import { showGlobalErrorOnce } from '@/shared/lib/global-overlay';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const meta = (query as unknown as { meta?: Record<string, unknown> } | undefined)?.meta;
      if (meta && meta.skipGlobalError === true) return;
      const message = getErrorMessage(error);
      showGlobalErrorOnce(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const meta = (mutation as unknown as { meta?: Record<string, unknown> } | undefined)?.meta;
      if (meta && meta.skipGlobalError === true) return;
      const message = getErrorMessage(error);
      showGlobalErrorOnce(message);
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
