import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { ExperienceGroup } from '@/entities/posts/model/experience-group';
import ExperienceGroupList from './experience-group-list';

const mocks = vi.hoisted(() => ({ open: vi.fn(), push: vi.fn(), scoped: true }));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mocks.scoped ? 'experienceBoard=true' : ''),
}));
vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ source: 'app', push: mocks.push }),
}));
vi.mock('@/shared/lib/app-bridge', () => ({
  normalizeSource: (source: string) => source,
  openInAppWebView: mocks.open,
}));
vi.mock('../../api/use-create-experience-group-reading-mutation', () => ({
  default: () => ({ mutate: vi.fn() }),
}));
vi.mock('@/shared/hooks/use-intersection-observer', () => ({
  useIntersectionObserver: () => null,
}));
vi.mock('./post-list-item', () => ({
  default: ({ onClick }: { onClick: () => void }) => <button onClick={onClick}>모집글</button>,
}));
vi.mock('./post-list-empty-view', () => ({ default: () => null }));
vi.mock('@/shared', () => ({
  ROUTES: { POSTS_EXPERIENCE_GROUP_DETAIL: (id: string) => `/posts/experience-groups/${id}` },
}));
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.scoped = true;
  mocks.open.mockReturnValue(true);
});
const rows = [{ id: 42, isRead: true, user: { address: '' } }] as ExperienceGroup[];
it('전용 게시판 상세 브리지에 복귀 출처를 전달한다', () => {
  render(<ExperienceGroupList experienceGroups={rows} tab="latest" fetchNextPage={() => {}} />);
  fireEvent.click(screen.getByText('모집글'));
  expect(mocks.open).toHaveBeenCalledWith(
    '/hair-consultation/experience-groups/42?experienceBoard=true',
    { reloadOnReturn: false },
  );
  expect(mocks.push).not.toHaveBeenCalled();
});
it('기존 목록 진입의 상세 브리지 계약은 유지한다', () => {
  mocks.scoped = false;
  render(<ExperienceGroupList experienceGroups={rows} tab="latest" fetchNextPage={() => {}} />);
  fireEvent.click(screen.getByText('모집글'));
  expect(mocks.open).toHaveBeenCalledWith('/hair-consultation/experience-groups/42', {
    reloadOnReturn: false,
  });
});
it('네이티브 채널이 없으면 웹 상세를 연다', () => {
  mocks.open.mockReturnValue(false);
  render(<ExperienceGroupList experienceGroups={rows} tab="my" fetchNextPage={() => {}} />);
  fireEvent.click(screen.getByText('모집글'));
  expect(mocks.push).toHaveBeenCalledWith('/posts/experience-groups/42', { postListTab: 'my' });
});
