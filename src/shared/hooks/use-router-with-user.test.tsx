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
  it('체험단 작성 완료는 전용 내 글 목록으로 돌아온다', () => {
    mocks.searchParams.experienceBoard = 'true';
    const { result } = renderHook(() => useRouterWithUser());
    act(() => result.current.replace('/posts', { postTab: 'experienceGroup', postListTab: 'my' }));
    const url = new URL(mocks.replace.mock.calls[0][0], 'https://example.com');
    expect(url.pathname).toBe('/experience-groups');
    expect(url.searchParams.get('experienceBoard')).toBe('true');
    expect(url.searchParams.get('postListTab')).toBe('my');
    expect(url.searchParams.get('userId')).toBe('71297');
  });

  it('체험단 작성과 수정 화면 이동에 게시판 출처를 보존한다', () => {
    mocks.searchParams.experienceBoard = 'true';
    const { result } = renderHook(() => useRouterWithUser());
    for (const path of ['/posts/create', '/posts/experience-groups/42/edit']) {
      act(() => result.current.push(path, { postTab: 'experienceGroup' }));
      const url = new URL(mocks.push.mock.lastCall![0], 'https://example.com');
      expect(url.pathname).toBe(path);
      expect(url.searchParams.get('experienceBoard')).toBe('true');
      expect(url.searchParams.get('postTab')).toBe('experienceGroup');
    }
  });
  it('상세 → 수정 → 상세 이동에서 삭제 목록 복귀 지원을 유지한다', () => {
    mocks.searchParams.supportsExperienceGroupListReturn = 'true';
    const { result, rerender } = renderHook(() => useRouterWithUser());
    act(() => result.current.push('/posts/experience-groups/42/edit'));
    const editUrl = new URL(mocks.push.mock.lastCall![0], 'https://example.com');
    expect(editUrl.searchParams.get('supportsExperienceGroupListReturn')).toBe('true');
    mocks.searchParams = Object.fromEntries(editUrl.searchParams);
    rerender();
    act(() => result.current.replace('/posts/experience-groups/42'));
    const detailUrl = new URL(mocks.replace.mock.lastCall![0], 'https://example.com');
    expect(detailUrl.searchParams.get('supportsExperienceGroupListReturn')).toBe('true');
  });

  it('쿼리 없이 연 브라우저 체험단 게시판에서도 작성 후 복귀 출처를 유지한다', () => {
    const previous = window.location.href;
    window.history.replaceState(null, '', '/experience-groups');
    try {
      const { result } = renderHook(() => useRouterWithUser());
      act(() => result.current.push('/posts/create', { postTab: 'experienceGroup' }));
      const url = new URL(mocks.push.mock.lastCall![0], 'https://example.com');
      expect(url.searchParams.get('experienceBoard')).toBe('true');
    } finally {
      window.history.replaceState(null, '', previous);
    }
  });
});
