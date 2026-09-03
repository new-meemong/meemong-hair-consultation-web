import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/shared/api/client';

import useGetMongRewardPresets from './use-get-mong-reward-presets';

vi.mock('@/shared/api/client', () => ({
  apiClient: { getList: vi.fn() },
}));

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  }

  return { client, Wrapper };
}

describe('useGetMongRewardPresets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClient.getList).mockResolvedValue({ dataList: [], dataCount: 0 });
  });

  it('활성화된 서버 몽 리워드 프리셋을 조회한다', async () => {
    const { client, Wrapper } = makeWrapper();
    const { result } = renderHook(() => useGetMongRewardPresets({ isActive: true }), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.getList).toHaveBeenCalledWith('mong-reward-presets', {
      searchParams: { isActive: true },
    });
    expect(
      client.getQueryCache().find({
        queryKey: ['mong-reward-presets', { isActive: true }],
      })?.meta,
    ).toEqual({ skipGlobalError: true });
  });

  it('비활성 옵션에서는 프리셋을 조회하지 않는다', () => {
    const { Wrapper } = makeWrapper();
    renderHook(() => useGetMongRewardPresets({ isActive: true }, { enabled: false }), {
      wrapper: Wrapper,
    });

    expect(apiClient.getList).not.toHaveBeenCalled();
  });
});
