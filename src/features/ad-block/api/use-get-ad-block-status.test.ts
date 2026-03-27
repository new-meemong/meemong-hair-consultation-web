import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  STORE_RETURN_STATUS_KEYS,
  markPendingStoreReturnStatusCheck,
} from '@/shared/lib/store-return-status';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { createElement } from 'react';
import useGetAdBlockStatus from './use-get-ad-block-status';
import { useOptionalBrand } from '@/shared/context/brand-context';

const mockRefetch = vi.fn().mockResolvedValue({});

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: vi.fn(() => ({ data: undefined, refetch: mockRefetch })),
  };
});

vi.mock('@/shared/api/client', () => ({
  apiClient: { get: vi.fn() },
}));

vi.mock('@/shared/context/brand-context', () => ({
  useOptionalBrand: vi.fn(),
}));

const mockBrandConfig = {
  config: {
    slug: 'test-brand',
    name: 'Test Brand',
    displayName: 'Test Brand',
    brandCode: 'TESTBD',
    logo: { src: { src: '/logo.png', width: 100, height: 100 }, width: 100, height: 100 },
    smallLogo: { src: { src: '/small-logo.png', width: 50, height: 50 } },
    theme: {},
    features: { chat: false, mong: false, growthPass: false },
  },
};

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: { children: unknown }) {
    return createElement(QueryClientProvider, { client }, children as React.ReactNode);
  }
  return Wrapper;
}

describe('useGetAdBlockStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('브랜드 웹에서 store return 후 refetch를 호출하지 않는다', async () => {
    vi.mocked(useOptionalBrand).mockReturnValue(mockBrandConfig);
    markPendingStoreReturnStatusCheck(STORE_RETURN_STATUS_KEYS.MEEMONG_PASS);

    renderHook(() => useGetAdBlockStatus(), { wrapper: makeWrapper() });

    // useRefetchOnStoreReturn이 mount 시 hasPendingStoreReturnStatusCheck를 확인하고 refetch를 호출하려 하지만
    // brand guard에 의해 차단되어야 함
    await waitFor(() => {
      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  it('웹뷰 컨텍스트에서 store return 후 refetch를 호출한다', async () => {
    vi.mocked(useOptionalBrand).mockReturnValue(null);
    markPendingStoreReturnStatusCheck(STORE_RETURN_STATUS_KEYS.MEEMONG_PASS);

    renderHook(() => useGetAdBlockStatus(), { wrapper: makeWrapper() });

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
