import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement, type ReactNode } from 'react';

import { getMyBrand } from '@/entities/brands/api/get-my-brand';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { apiClientWithoutAuth } from '@/shared/api/client';

import { useWebviewLogin } from './use-webview-login';

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
  getMyBrand: vi.fn(),
}));

vi.mock('@/shared/api/client', () => ({
  apiClientWithoutAuth: {
    post: mocks.post,
  },
}));

vi.mock('@/entities/brands/api/get-my-brand', () => ({
  getMyBrand: mocks.getMyBrand,
}));

const baseUserWithoutRole = {
  id: 1,
  email: 'designer@example.com',
  profilePictureURL: null,
  accessToken: null,
  socialCode: 'social-code',
  displayName: '디자이너',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  loginSession: 'session',
  loginType: 'KAKAO',
  fcmToken: null,
  sex: '여자',
  korean: '한국인',
  phone: '01000000000',
  recentLoginTime: null,
  recentRealLoginTime: null,
  lastViewDesignerViewDateTime: null,
  cacheProfilePictureURL: null,
  lastLoginAt: null,
  premiumThunderAnnouncementRemainingCount: 0,
  isExistPassword: false,
  appIdentifierId: null,
  token: 'token',
};

const baseUser = {
  ...baseUserWithoutRole,
  role: USER_ROLE.DESIGNER,
};

const registeredBrand = {
  id: 32,
  code: 'V2920',
  name: '보그헤어',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
};

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  }
  return Wrapper;
}

describe('useWebviewLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClientWithoutAuth.post).mockResolvedValue({
      data: baseUser,
      success: true,
    });
  });

  it('brands/me가 null을 반환하면 브랜드 없음으로 저장한다', async () => {
    vi.mocked(getMyBrand).mockResolvedValue(null);

    const { result } = renderHook(() => useWebviewLogin(), { wrapper: makeWrapper() });

    const response = await act(async () => result.current.mutateAsync({ userId: '1' }));

    expect(response.data.brand).toBeNull();
    expect(response.data.brandLookupFailed).toBe(false);
  });

  it('brands/me 조회 실패는 brand:null과 구분해서 저장한다', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getMyBrand).mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useWebviewLogin(), { wrapper: makeWrapper() });

    const response = await act(async () => result.current.mutateAsync({ userId: '1' }));

    expect(response.data.brand).toBeUndefined();
    expect(response.data.brandLookupFailed).toBe(true);
    consoleErrorSpy.mockRestore();
  });

  it('Role 필드만 있는 디자이너도 브랜드를 조회한다', async () => {
    vi.mocked(apiClientWithoutAuth.post).mockResolvedValue({
      data: {
        ...baseUserWithoutRole,
        Role: USER_ROLE.DESIGNER,
      },
      success: true,
    });
    vi.mocked(getMyBrand).mockResolvedValue(registeredBrand);

    const { result } = renderHook(() => useWebviewLogin(), { wrapper: makeWrapper() });

    const response = await act(async () => result.current.mutateAsync({ userId: '1' }));

    expect(getMyBrand).toHaveBeenCalledWith('token');
    expect(response.data.role).toBe(USER_ROLE.DESIGNER);
    expect(response.data.brand).toEqual(registeredBrand);
    expect(response.data.brandLookupFailed).toBe(false);
  });

  it('role과 Role이 모두 없으면 비정상 응답을 기록하고 브랜드 조회를 건너뛴다', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(apiClientWithoutAuth.post).mockResolvedValue({
      data: baseUserWithoutRole,
      success: true,
    });

    const { result } = renderHook(() => useWebviewLogin(), { wrapper: makeWrapper() });

    const response = await act(async () => result.current.mutateAsync({ userId: '1' }));

    expect(consoleErrorSpy).toHaveBeenCalledWith('webview-login 응답에 role/Role이 없습니다.', {
      userId: 1,
    });
    expect(getMyBrand).not.toHaveBeenCalled();
    expect(response.data.role).toBeUndefined();
    expect(response.data.brand).toBeNull();
    expect(response.data.brandLookupFailed).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
