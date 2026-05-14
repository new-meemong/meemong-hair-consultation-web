import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from './auth-context';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { getMyBrand } from '@/entities/brands/api/get-my-brand';
import { useSearchParams } from 'next/navigation';
import { useWebviewLogin } from '@/features/auth/api/use-webview-login';

const mocks = vi.hoisted(() => ({
  loginAsync: vi.fn(),
  getMyBrand: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('@/features/auth/api/use-webview-login', () => ({
  useWebviewLogin: vi.fn(),
}));

vi.mock('@/entities/brands/api/get-my-brand', () => ({
  getMyBrand: mocks.getMyBrand,
}));

const USER_DATA_KEY = 'user_data';
const TOKEN =
  'header.' +
  Buffer.from(JSON.stringify({ userId: 1, exp: Math.floor(Date.now() / 1000) + 60 * 60 })).toString(
    'base64url',
  ) +
  '.signature';

const vogBrand = {
  id: 32,
  code: 'V2920',
  name: '보그헤어',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
};

function createCachedUser({
  role = USER_ROLE.DESIGNER,
  brand = null,
  includeBrand = true,
  brandLookupFailed,
  includeToken = true,
}: {
  role?: (typeof USER_ROLE)[keyof typeof USER_ROLE];
  brand?: unknown;
  includeBrand?: boolean;
  brandLookupFailed?: boolean;
  includeToken?: boolean;
} = {}) {
  const user: Record<string, unknown> = {
    id: 1,
    email: 'designer@example.com',
    profilePictureURL: null,
    accessToken: null,
    socialCode: 'social-code',
    displayName: '디자이너',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    loginSession: 'session',
    role,
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
    consultingPost: null,
    hairConsultation: null,
    consultingResponse: [],
    experienceGroup: null,
  };

  if (includeToken) {
    user.token = TOKEN;
  }

  if (includeBrand) {
    user.brand = brand;
  }
  if (brandLookupFailed !== undefined) {
    user.brandLookupFailed = brandLookupFailed;
  }

  return user;
}

function cacheUser(user: Record<string, unknown>) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

function renderAuthProvider() {
  render(
    <AuthProvider>
      <div>authenticated</div>
    </AuthProvider>,
  );
}

describe('AuthProvider brand sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams({ userId: '1' }) as unknown as ReturnType<typeof useSearchParams>,
    );
    vi.mocked(useWebviewLogin).mockReturnValue({
      mutateAsync: mocks.loginAsync,
      isError: false,
    } as unknown as ReturnType<typeof useWebviewLogin>);
    vi.mocked(getMyBrand).mockResolvedValue(null);
    mocks.loginAsync.mockResolvedValue(undefined);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('디자이너의 cached brand:null은 첫 mount에서 brands/me만 재조회한다', async () => {
    cacheUser(createCachedUser({ brand: null }));
    vi.mocked(getMyBrand).mockResolvedValue(vogBrand);

    renderAuthProvider();

    expect(screen.queryByText('authenticated')).toBeNull();
    await waitFor(() => expect(screen.getByText('authenticated')).toBeTruthy());
    await waitFor(() => expect(getMyBrand).toHaveBeenCalledWith(TOKEN));

    expect(mocks.loginAsync).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem(USER_DATA_KEY) ?? '{}').brand).toEqual(vogBrand);
  });

  it('디자이너의 cached brand:null이 실제 미등록이면 brandLookupFailed=false로 렌더한다', async () => {
    cacheUser(createCachedUser({ brand: null }));
    vi.mocked(getMyBrand).mockResolvedValue(null);

    renderAuthProvider();

    await waitFor(() => expect(screen.getByText('authenticated')).toBeTruthy());

    const cachedUser = JSON.parse(localStorage.getItem(USER_DATA_KEY) ?? '{}');
    expect(cachedUser.brand).toBeNull();
    expect(cachedUser.brandLookupFailed).toBe(false);
  });

  it('디자이너 브랜드 재조회 실패는 brandLookupFailed=true로 저장하고 렌더를 풀어준다', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    cacheUser(createCachedUser({ brand: null }));
    vi.mocked(getMyBrand).mockRejectedValue(new Error('network'));

    renderAuthProvider();

    await waitFor(() => expect(screen.getByText('authenticated')).toBeTruthy());

    const cachedUser = JSON.parse(localStorage.getItem(USER_DATA_KEY) ?? '{}');
    expect(cachedUser.brand).toBeNull();
    expect(cachedUser.brandLookupFailed).toBe(true);
    consoleErrorSpy.mockRestore();
  });

  it('디자이너의 brandLookupFailed 캐시는 렌더를 막지 않고 brands/me를 재조회한다', async () => {
    cacheUser(createCachedUser({ includeBrand: false, brandLookupFailed: true }));

    renderAuthProvider();

    await waitFor(() => expect(screen.getByText('authenticated')).toBeTruthy());
    await waitFor(() => expect(getMyBrand).toHaveBeenCalledWith(TOKEN));
    expect(mocks.loginAsync).not.toHaveBeenCalled();
  });

  it('URL userId가 캐시 유저와 다르면 이전 유저 token으로 brands/me를 호출하지 않는다', async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams({ userId: '2' }) as unknown as ReturnType<typeof useSearchParams>,
    );
    cacheUser(createCachedUser({ brand: null }));

    renderAuthProvider();

    await waitFor(() => expect(mocks.loginAsync).toHaveBeenCalledWith({ userId: '2' }));
    expect(getMyBrand).not.toHaveBeenCalled();
  });

  it('token이 누락된 캐시는 brands/me 대신 full webview-login으로 보정한다', async () => {
    cacheUser(createCachedUser({ brand: null, includeToken: false }));

    renderAuthProvider();

    await waitFor(() => expect(mocks.loginAsync).toHaveBeenCalledWith({ userId: '1' }));
    expect(getMyBrand).not.toHaveBeenCalled();
    expect(screen.queryByText('authenticated')).toBeNull();
  });

  it('throttle 안의 focus에서는 brands/me를 다시 호출하지 않고, throttle 밖에서는 호출한다', async () => {
    let now = 1_000_000;
    const dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => now);
    cacheUser(createCachedUser({ brand: null }));

    renderAuthProvider();

    await waitFor(() => expect(getMyBrand).toHaveBeenCalledTimes(1));

    now += 1_000;
    await act(async () => {
      window.dispatchEvent(new Event('focus'));
    });
    expect(getMyBrand).toHaveBeenCalledTimes(1);

    now += 5_000;
    await act(async () => {
      window.dispatchEvent(new Event('focus'));
    });
    await waitFor(() => expect(getMyBrand).toHaveBeenCalledTimes(2));

    dateNowSpy.mockRestore();
  });

  it('focus와 visibility가 연속 발생해도 진행 중인 브랜드 재조회는 중복 호출하지 않는다', async () => {
    let resolveBrand: (value: null) => void = () => undefined;
    const brandPromise = new Promise<null>((resolve) => {
      resolveBrand = resolve;
    });
    cacheUser(createCachedUser({ brand: null }));
    vi.mocked(getMyBrand).mockReturnValue(brandPromise);

    renderAuthProvider();

    await waitFor(() => expect(getMyBrand).toHaveBeenCalledTimes(1));

    await act(async () => {
      window.dispatchEvent(new Event('focus'));
      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        configurable: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(getMyBrand).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveBrand(null);
      await brandPromise;
    });
    await waitFor(() => expect(screen.getByText('authenticated')).toBeTruthy());
  });

  it('모델의 brand:null 캐시는 브랜드 재조회 대상이 아니다', async () => {
    cacheUser(createCachedUser({ role: USER_ROLE.MODEL, brand: null }));

    renderAuthProvider();

    await waitFor(() => expect(screen.getByText('authenticated')).toBeTruthy());
    expect(getMyBrand).not.toHaveBeenCalled();
    expect(mocks.loginAsync).not.toHaveBeenCalled();
  });

  it('brand 필드가 누락된 오래된 디자이너 캐시는 full webview-login으로 보정한다', async () => {
    cacheUser(createCachedUser({ includeBrand: false }));

    renderAuthProvider();

    await waitFor(() => expect(mocks.loginAsync).toHaveBeenCalledWith({ userId: '1' }));
    expect(getMyBrand).not.toHaveBeenCalled();
  });

  it('webview-login에서 brand:null을 방금 받으면 초기 brands/me 재조회를 중복 호출하지 않는다', async () => {
    const loginUser = createCachedUser({ brand: null });
    const loginAsync = vi.fn(async () => {
      return { data: loginUser };
    });

    vi.mocked(useWebviewLogin).mockImplementation((options = {}) => {
      loginAsync.mockImplementation(async () => {
        options.onSuccess?.({ data: loginUser as never });
        options.onSettled?.();
        return { data: loginUser };
      });

      return {
        mutateAsync: loginAsync,
        isError: false,
      } as unknown as ReturnType<typeof useWebviewLogin>;
    });
    cacheUser(createCachedUser({ includeBrand: false }));

    renderAuthProvider();

    await waitFor(() => expect(screen.getByText('authenticated')).toBeTruthy());
    expect(loginAsync).toHaveBeenCalledWith({ userId: '1' });
    expect(getMyBrand).not.toHaveBeenCalled();
  });
});
