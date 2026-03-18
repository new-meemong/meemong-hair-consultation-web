import { useCallback, useEffect } from 'react';

import {
  clearPendingStoreReturnStatusCheck,
  hasPendingStoreReturnStatusCheck,
  type StoreReturnStatusKey,
} from '@/shared/lib/store-return-status';

type UseRefetchOnStoreReturnParams = {
  pendingKey: StoreReturnStatusKey;
  refetch: () => Promise<unknown>;
};

export default function useRefetchOnStoreReturn({
  pendingKey,
  refetch,
}: UseRefetchOnStoreReturnParams) {
  const handleReturn = useCallback(async () => {
    if (!hasPendingStoreReturnStatusCheck(pendingKey)) return;

    try {
      await refetch();
      clearPendingStoreReturnStatusCheck(pendingKey);
    } catch {
      // 재조회 실패 시 다음 복귀/포커스에서 다시 시도합니다.
    }
  }, [pendingKey, refetch]);

  useEffect(() => {
    void handleReturn();

    const handleFocus = () => {
      void handleReturn();
    };

    const handlePageShow = () => {
      void handleReturn();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void handleReturn();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleReturn]);
}
