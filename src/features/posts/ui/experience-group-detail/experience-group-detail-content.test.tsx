import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExperienceGroupDetail } from '@/entities/posts/model/experience-group-detail';
import { AD_COMPLETION_TIMEOUT_MS } from '@/shared/lib/request-ad-before-action-in-app';
import ExperienceGroupDetailContent from './experience-group-detail-content';

const state = vi.hoisted(() => ({
  auth: { isUserModel: false, isUserDesigner: true },
  showModal: vi.fn(),
}));
vi.mock('@/shared', async () => {
  const { cn } = await import('@/lib/utils');
  return { cn };
});
vi.mock('@/features/auth/context/auth-context', () => ({ useAuthContext: () => state.auth }));
vi.mock('@/shared/ui/hooks/use-show-modal', () => ({ default: () => state.showModal }));
vi.mock('../post-detail/post-detail-author-profile', () => ({ default: () => null }));

const detail: ExperienceGroupDetail = {
  id: 1,
  title: '체험단',
  content: '내용',
  priceType: 'FREE',
  price: 0,
  viewCount: 0,
  commentCount: 0,
  likeCount: 0,
  createdAt: '2026-09-08T00:00:00Z',
  updatedAt: '2026-09-08T00:00:00Z',
  user: { id: 1, displayName: '작성자', profilePictureURL: '', role: 1 },
  snsTypes: [
    { id: 1, snsType: 'Instagram', url: 'https://instagram.com/example' },
    { id: 2, snsType: 'Blog', url: 'https://example.com/blog' },
  ],
  isAnonymous: false,
  isLiked: false,
  isRead: true,
};

function setup() {
  const postMessage = vi.fn();
  window.ShowAdBeforeAction = { postMessage };
  const external = vi.fn();
  Object.assign(window, { ExternalLink: { postMessage: external } });
  const view = render(<ExperienceGroupDetailContent experienceGroupDetail={detail} />);
  const links = screen.getAllByRole('button', { name: '바로가기' });
  const complete = async (isCompleted: boolean, index = 0) => {
    const { requestId } = JSON.parse(postMessage.mock.calls[index][0]);
    await act(async () => {
      window.__meemongResolveAdBeforeAction?.({ requestId, isCompleted });
    });
  };
  return { ...view, postMessage, external, links, complete };
}

describe('체험단 SNS 링크의 실제 광고 브리지 연결', () => {
  beforeEach(() => {
    state.auth = { isUserModel: false, isUserDesigner: true };
    state.showModal.mockClear();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    for (const key of ['ShowAdBeforeAction', '__meemongResolveAdBeforeAction', 'ExternalLink']) {
      Reflect.deleteProperty(window, key);
    }
  });

  it('정책 판단을 앱에 요청하고 완료 또는 패스 면제 응답 이후 한 번만 이동한다', async () => {
    const { links, postMessage, external, complete } = setup();
    fireEvent.click(links[0]);
    fireEvent.click(links[0]);
    fireEvent.click(links[1]);
    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(JSON.parse(postMessage.mock.calls[0][0]).adType).toBe('sns-url-in-experience-group');
    expect(external).not.toHaveBeenCalled();
    await complete(true);
    await complete(true);
    expect(external).toHaveBeenCalledTimes(1);
    expect(external.mock.calls[0][0]).toContain(detail.snsTypes[0].url);
  });

  it('광고 취소 시 이동하지 않고 다음 클릭을 다시 판단한다', async () => {
    const { links, external, postMessage, complete } = setup();
    fireEvent.click(links[0]);
    await complete(false);
    expect(external).not.toHaveBeenCalled();
    fireEvent.click(links[1]);
    expect(postMessage).toHaveBeenCalledTimes(2);
    await complete(true, 1);
    expect(external.mock.calls[0][0]).toContain(detail.snsTypes[1].url);
  });

  it('응답 제한 시간이 지나면 이동하지 않고 재시도할 수 있다', async () => {
    vi.useFakeTimers();
    const { links, external, postMessage, complete } = setup();
    fireEvent.click(links[0]);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(AD_COMPLETION_TIMEOUT_MS);
    });
    expect(external).not.toHaveBeenCalled();
    fireEvent.click(links[0]);
    expect(postMessage).toHaveBeenCalledTimes(2);
    await complete(false, 1);
  });

  it('화면을 떠난 뒤 도착한 응답은 링크를 열지 않는다', async () => {
    const { links, external, complete, unmount } = setup();
    fireEvent.click(links[0]);
    unmount();
    await complete(true);
    expect(external).not.toHaveBeenCalled();
  });

  it('모델은 광고 요청과 외부 이동 없이 기존 안내를 받는다', () => {
    state.auth = { isUserModel: true, isUserDesigner: false };
    const { links, external, postMessage } = setup();
    fireEvent.click(links[0]);
    expect(state.showModal).toHaveBeenCalledOnce();
    expect(postMessage).not.toHaveBeenCalled();
    expect(external).not.toHaveBeenCalled();
  });

  it('네이티브 채널이 없는 브라우저에서는 기존 외부 링크를 연다', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    render(<ExperienceGroupDetailContent experienceGroupDetail={detail} />);
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: '바로가기' })[0]);
    });
    expect(open).toHaveBeenCalledWith(detail.snsTypes[0].url, '_blank', 'noopener,noreferrer');
  });
});
