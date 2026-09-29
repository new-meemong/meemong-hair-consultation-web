import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRouterWithUser } from './use-router-with-user';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  searchParams: {} as Record<string, string>,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.push,
    replace: mocks.replace,
    back: mocks.back,
    forward: mocks.forward,
  }),
  useSearchParams: () => ({
    get: (key: string) => mocks.searchParams[key] ?? null,
  }),
}));

describe('useRouterWithUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.searchParams = {
      userId: '71297',
      source: 'app',
      supportsFullWebviewPostCreate: 'true',
    };
  });

  it('메인 WebView의 작성 route 지원 정보를 내부 이동에도 보존한다', () => {
    const { result } = renderHook(() => useRouterWithUser());

    act(() => {
      result.current.replace('/posts', {
        postTab: 'experienceGroup',
        postListTab: 'my',
      });
    });

    expect(mocks.replace).toHaveBeenCalledWith(
      '/posts?userId=71297&source=app&supportsFullWebviewPostCreate=true&postTab=experienceGroup&postListTab=my',
    );
  });

  it('상담 최초 출처를 답변 상세 이동에도 보존한다', () => {
    mocks.searchParams.chatEntry = 'model_home_consultation';
    const { result } = renderHook(() => useRouterWithUser());
    act(() => result.current.push('/posts/1/consulting/2'));
    expect(mocks.push.mock.calls[0][0]).toContain('chatEntry=model_home_consultation');
  });

  it('지원 정보가 없는 구버전 진입에는 신규 기능을 추가하지 않는다', () => {
    delete mocks.searchParams.supportsFullWebviewPostCreate;
    const { result } = renderHook(() => useRouterWithUser());

    act(() => {
      result.current.push('/posts/create');
    });

    expect(mocks.push).toHaveBeenCalledWith('/posts/create?userId=71297&source=app');
  });
});
