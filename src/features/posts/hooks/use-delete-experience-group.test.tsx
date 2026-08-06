import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useDeleteExperienceGroup from './use-delete-experience-group';

const mocks = vi.hoisted(() => ({
  closeAppWebView: vi.fn(),
  deleteExperienceGroup: vi.fn(),
  push: vi.fn(),
  showModal: vi.fn(),
  source: 'app' as string | null,
  supportsExperienceGroupListReturn: true,
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) =>
      key === 'supportsExperienceGroupListReturn' && mocks.supportsExperienceGroupListReturn
        ? 'true'
        : null,
  }),
}));

vi.mock('@/shared', () => ({
  ROUTES: { POSTS: '/posts' },
}));

vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({
    push: mocks.push,
    source: mocks.source,
  }),
}));

vi.mock('@/shared/lib/app-bridge', () => ({
  closeAppWebView: mocks.closeAppWebView,
  normalizeSource: (source: string | null | undefined) => (source === 'app' ? 'app' : 'web'),
}));

vi.mock('@/shared/ui/hooks/use-show-modal', () => ({
  default: () => mocks.showModal,
}));

vi.mock('../api/use-delete-experience-group-mutation', () => ({
  default: () => ({ mutate: mocks.deleteExperienceGroup }),
}));

type ModalRequest = {
  buttons: Array<{ onClick?: () => void }>;
};

function latestModalRequest(): ModalRequest {
  return mocks.showModal.mock.calls.at(-1)?.[0] as ModalRequest;
}

describe('useDeleteExperienceGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.source = 'app';
    mocks.supportsExperienceGroupListReturn = true;
    mocks.closeAppWebView.mockReturnValue(true);
    mocks.deleteExperienceGroup.mockImplementation(
      (_id: string, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    );
  });

  it('구버전 앱에는 기존 문자열 닫기 메시지를 유지한다', () => {
    mocks.supportsExperienceGroupListReturn = false;
    const { result } = renderHook(() => useDeleteExperienceGroup('2320'));

    act(() => result.current.handleDelete());
    act(() => latestModalRequest().buttons[0].onClick?.());
    act(() => latestModalRequest().buttons[0].onClick?.());

    expect(mocks.closeAppWebView).toHaveBeenCalledWith('close');
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('앱에서 삭제 완료 후 상세 WebView를 닫아 하단 탭 목록으로 복귀한다', () => {
    const { result } = renderHook(() => useDeleteExperienceGroup('2320'));

    act(() => result.current.handleDelete());
    act(() => latestModalRequest().buttons[0].onClick?.());
    act(() => latestModalRequest().buttons[0].onClick?.());

    expect(mocks.closeAppWebView).toHaveBeenCalledWith({
      type: 'close',
      target: 'experienceGroupMyList',
    });
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('네이티브 닫기 브리지가 없으면 체험단 내 글 웹 목록으로 이동한다', () => {
    mocks.closeAppWebView.mockReturnValue(false);
    const { result } = renderHook(() => useDeleteExperienceGroup('2320'));

    act(() => result.current.handleDelete());
    act(() => latestModalRequest().buttons[0].onClick?.());
    act(() => latestModalRequest().buttons[0].onClick?.());

    expect(mocks.push).toHaveBeenCalledWith('/posts', {
      postTab: 'experienceGroup',
      postListTab: 'my',
    });
  });
});
