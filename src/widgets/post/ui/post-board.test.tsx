import type { ReactNode } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ExperienceGroupBoardPage from '@/app/(webview)/experience-groups/page';
import PostBoard from './post-board';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  nativeOpen: vi.fn(),
  model: true,
  brand: null as null | { config: { slug: string } },
  postTab: 'consulting',
  source: 'app',
  query: 'supportsFullWebviewPostCreate=true',
}));
vi.mock('@/features/auth/context/auth-context', () => ({
  useOptionalAuthContext: () => ({
    user: { role: mocks.model ? 1 : 2 },
    isUserModel: mocks.model,
    isUserDesigner: !mocks.model,
  }),
}));
vi.mock('@/entities/user/lib/user-role', () => ({ getUserRole: () => (mocks.model ? 1 : 2) }));
vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ push: mocks.push, source: mocks.source }),
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mocks.query),
}));
vi.mock('@/shared/context/brand-context', () => ({ useOptionalBrand: () => mocks.brand }));
vi.mock('@/shared/hooks/use-scroll-restoration', () => ({
  POSTS_PAGE_KEY: 'posts',
  useScrollRestoration: () => ({ containerRef: null }),
}));
vi.mock('@/features/posts/hooks/use-post-tab', () => ({
  usePostTab: () => [mocks.postTab, vi.fn()],
}));
vi.mock('@/features/posts/hooks/use-post-list-tab', () => ({ default: () => ['latest', vi.fn()] }));
vi.mock('@/features/posts/hooks/use-post-list-region-tab', () => ({
  default: () => ({ regionTab: { id: 'region', label: '지역' }, userSelectedRegionData: null }),
}));
vi.mock('@/features/posts/hooks/use-post-list-brand-tab', () => ({
  default: () => ({ brandTab: null, selectedBrandId: null }),
}));
vi.mock('@/features/posts/lib/get-post-list-tabs', () => ({
  getPostListTabs: (role: number) => [
    { id: 'latest', label: '최신글' },
    ...(role === 1 ? [{ id: 'my', label: '내 상담글' }] : []),
    { id: 'comment', label: '댓글 단 글' },
  ],
}));
vi.mock('@/features/posts/hooks/use-model-write-guard', () => ({
  useModelWriteGuard: ({ onProceedWrite }: { onProceedWrite: () => void }) => ({
    handleWriteButtonClick: onProceedWrite,
  }),
}));
vi.mock('@/shared/lib/app-bridge', () => ({ openInAppWebView: mocks.nativeOpen }));
vi.mock('@/shared', () => ({
  ROUTES: {
    POSTS_CREATE: '/posts/create',
    WEB_POSTS_CREATE: (slug: string) => `/${slug}/posts/create`,
  },
}));
vi.mock('@/shared/ui', () => ({
  ToggleChipGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ToggleChip: ({ children }: { children: ReactNode }) => <button>{children}</button>,
}));
vi.mock('@/shared/ui/tab', () => ({ default: () => <div>상담 체험단 탭</div> }));
vi.mock('@/widgets/header', () => ({ SiteHeader: () => null }));
vi.mock('@/features/banner/ui/promotion-banner', () => ({ default: () => <div>프로모션</div> }));
vi.mock('@/features/auth/ui/top-advisor-carousel', () => ({ default: () => null }));
vi.mock('@/features/posts/ui/model-break-release-bottom-sheet', () => ({ default: () => null }));
vi.mock('@/features/posts/ui/write-post-button', () => ({
  WritePostButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>글쓰기</button>
  ),
}));
vi.mock('./consulting-post/consulting-post-list-container', () => ({
  default: () => <div>상담 목록</div>,
}));
vi.mock('./experience-group/experience-group-list-container', () => ({
  default: () => <div>체험단 목록</div>,
}));

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.model = true;
  mocks.brand = null;
  mocks.postTab = 'consulting';
  mocks.source = 'app';
  mocks.query = 'supportsFullWebviewPostCreate=true';
  mocks.nativeOpen.mockReturnValue(false);
});
describe('신규 웹에서 연 이전 내역과 레거시 앱의 진입 구분', () => {
  it.each([
    ['app', true],
    ['web', true],
    ['app', false],
    ['web', false],
  ] as const)('%s 이전 내역 진입에서만 글쓰기와 체험단 탭을 숨긴다 (고객: %s)', (source, model) => {
    mocks.source = source;
    mocks.model = model;
    mocks.query += '&legacyHistory=true';
    render(<PostBoard />);
    expect(screen.getByText('상담 목록')).toBeTruthy();
    expect(screen.queryByText('글쓰기')).toBeNull();
    expect(screen.queryByText('상담 체험단 탭')).toBeNull();
    expect(screen.queryByText('체험단 목록')).toBeNull();
    expect(mocks.push).not.toHaveBeenCalled();
    expect(mocks.nativeOpen).not.toHaveBeenCalled();
  });
  it('이전 내역 진입은 기존 쿼리에 체험단이 선택되어 있어도 상담 목록을 연다', () => {
    mocks.query += '&legacyHistory=true';
    mocks.postTab = 'experienceGroup';
    render(<PostBoard />);
    expect(screen.getByText('상담 목록')).toBeTruthy();
    expect(screen.queryByText('체험단 목록')).toBeNull();
  });
  it('레거시 앱의 기존 글쓰기와 탭을 유지한다', () => {
    render(<PostBoard />);
    expect(screen.getByText('상담 체험단 탭')).toBeTruthy();
    fireEvent.click(screen.getByText('글쓰기'));
    expect(mocks.nativeOpen).toHaveBeenCalledWith(
      '/hair-consultation/posts/create?postTab=consulting',
    );
  });
  it('레거시 앱의 기존 목록에서 체험단 신청을 유지한다', () => {
    mocks.postTab = 'experienceGroup';
    render(<PostBoard />);
    fireEvent.click(screen.getByText('글쓰기'));
    expect(mocks.nativeOpen).toHaveBeenCalledWith(
      '/hair-consultation/posts/create?postTab=experienceGroup',
    );
  });
  it('브랜드 전용 상담의 새 상담글 진입점은 유지한다', () => {
    mocks.brand = { config: { slug: 'brand' } };
    mocks.query += '&legacyHistory=true';
    render(<PostBoard />);
    expect(screen.getByText('글쓰기')).toBeTruthy();
    expect(screen.getByText('상담 체험단 탭')).toBeTruthy();
  });
  it('별도 설정 탭에서 여는 체험단 전용 게시판을 제한하지 않는다', () => {
    mocks.query += '&legacyHistory=true';
    render(<ExperienceGroupBoardPage />);
    expect(screen.getByText('체험단 목록')).toBeTruthy();
    fireEvent.click(screen.getByText('글쓰기'));
    expect(mocks.push).toHaveBeenCalledWith('/posts/create', { postTab: 'experienceGroup' });
  });
});
describe('체험단 전용 route', () => {
  it('고객은 체험단만 보고 기존 협찬 신청서를 연다', () => {
    render(<ExperienceGroupBoardPage />);
    expect(screen.getByText('체험단 목록')).toBeTruthy();
    expect(screen.queryByText('상담 목록')).toBeNull();
    expect(screen.queryByText('상담 체험단 탭')).toBeNull();
    expect(screen.queryByText('프로모션')).toBeNull();
    expect(screen.queryByText('댓글 단 글')).toBeNull();
    expect(screen.getByText('내 체험단 글')).toBeTruthy();
    fireEvent.click(screen.getByText('글쓰기'));
    expect(mocks.push).toHaveBeenCalledWith('/posts/create', { postTab: 'experienceGroup' });
    expect(mocks.nativeOpen).not.toHaveBeenCalled();
  });
  it('디자이너는 지역 필터로 체험단을 찾고 고객 작성 버튼은 보지 않는다', () => {
    mocks.model = false;
    render(<ExperienceGroupBoardPage />);
    expect(screen.getByText('체험단 목록')).toBeTruthy();
    expect(screen.getByText('지역')).toBeTruthy();
    expect(screen.queryByText('글쓰기')).toBeNull();
    expect(screen.queryByText('내 체험단 글')).toBeNull();
  });
});
