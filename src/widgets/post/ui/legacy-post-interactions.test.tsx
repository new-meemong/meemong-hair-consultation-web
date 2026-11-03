import type { ReactNode } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostDetailPage from '@/app/(webview)/posts/[postId]/page';
import { useHairConsultationCommentFormState } from '@/features/comments/hooks/use-hair-consultation-comment-form-state';

const state = vi.hoisted(() => ({ model: true, postId: '42', query: '', push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useParams: () => ({ postId: state.postId }),
  useSearchParams: () => new URLSearchParams('userId=77&source=app' + state.query),
}));
vi.mock('@/features/auth/context/auth-context', () => ({
  useOptionalAuthContext: () => ({
    user: { id: 77 },
    isUserModel: state.model,
    isUserDesigner: !state.model,
  }),
}));
vi.mock('@/shared/context/brand-context', () => ({ useOptionalBrand: () => null }));
vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ push: state.push, back: vi.fn() }),
}));
vi.mock('@/features/posts/context/post-detail-context', () => ({
  NewPostDetailProvider: ({ children }: { children: ReactNode }) => children,
  usePostDetail: () => ({
    postDetail: {
      id: 42,
      hairConsultPostingCreateUserId: 77,
      hairConsultPostingCreateUserName: '고객',
    },
  }),
}));
vi.mock('@/features/posts/api/use-get-hair-consultation-answers', () => ({ default: () => ({}) }));
vi.mock('@/features/ad-block/hook/use-meemong-pass-policy', () => ({ default: () => {} }));
vi.mock('@/features/posts/hooks/use-hair-consultation-brand-access', () => ({
  default: () => ({ isDesignerBlockedFromBrandPost: false }),
}));
vi.mock('@/features/posts/hooks/use-show-brand-staff-only-post-sheet', () => ({
  default: () => vi.fn(),
}));
vi.mock('@/shared/hooks/use-show-guide', () => ({ default: () => {} }));
vi.mock('@/features/posts/ui/post-detail/post-detail-more-button', () => ({ default: () => null }));
vi.mock('@/widgets/header', () => ({ SiteHeader: () => null }));
vi.mock('@/widgets/post/post-detail-container', () => ({
  PostDetailContainer: ({ children }: { children: ReactNode }) => children,
}));
vi.mock('@/widgets/comments/ui/hair-consultation-comment-container', () => ({
  default: () => null,
}));
vi.mock('@/assets/icons/chevron-right.svg', () => ({ default: () => null }));
vi.mock('@/assets/icons/arrow-up.svg', () => ({ default: () => null }));
vi.mock('@/shared', () => ({
  ROUTES: { POSTS_CREATE_CONSULTING_POST: (id: string) => `/posts/${id}/consulting/create` },
}));
vi.mock('@/shared/lib/app-bridge', () => ({
  normalizeSource: (s: string) => s,
  closeAppWebView: vi.fn(),
  startChatChannelInApp: vi.fn(),
}));
vi.mock('@/features/chat/hook/use-start-chat', () => ({ default: () => ({}) }));
vi.mock('@/features/mong/api/use-create-mong-withdraw-mutation', () => ({ default: () => ({}) }));
vi.mock('@/features/mong/api/use-get-mong-consume-presets', () => ({ default: () => ({}) }));
vi.mock('@/features/mong/api/use-get-mong-current', () => ({ default: () => ({}) }));
vi.mock('@/features/mong/hook/use-show-mong-insufficient-sheet', () => ({
  default: () => vi.fn(),
}));
vi.mock('@/features/mong/hook/use-show-comment-mong-consume-sheet', () => ({
  default:
    () =>
    ({ onSubmit }: { onSubmit: () => void }) =>
      onSubmit(),
}));
vi.mock('@/features/posts/hooks/use-writing-consulting-response', () => ({
  default: () => ({ hasSavedContent: false }),
}));
vi.mock('@/shared/context/overlay-context', () => ({
  useOverlayContext: () => ({ showBottomSheet: vi.fn(), showSnackBar: vi.fn() }),
}));
vi.mock('@/shared/ui/hooks/use-show-modal', () => ({
  default:
    () =>
    ({ buttons }: { buttons: { label: string; onClick?: () => void }[] }) =>
      buttons.find((button) => button.label === '등록하기')?.onClick?.(),
}));
vi.mock('@/features/chat/api/use-send-post-comment-push-notification', () => ({
  default: () => ({ mutate: vi.fn() }),
}));

let client: QueryClient;
let requests: { path: string; method: string; body: unknown }[];
beforeEach(() => {
  state.model = true;
  state.postId = '42';
  state.query = '';
  state.push.mockReset();
  requests = [];
  localStorage.clear();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = input instanceof Request ? input : new Request(input, init);
      requests.push({
        path: new URL(request.url).pathname,
        method: request.method,
        body: await request.json(),
      });
      return new Response(
        JSON.stringify({ success: true, data: { id: 12, mongConsumePreset: null } }),
        { headers: { 'content-type': 'application/json' } },
      );
    }),
  );
});
afterEach(() => {
  cleanup();
  client.clear();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const mount = () =>
  render(
    <QueryClientProvider client={client}>
      <PostDetailPage />
    </QueryClientProvider>,
  );

describe('이전 상담 내역의 댓글·답변과 레거시 앱 작성 호환', () => {
  it.each(['', '&legacyHistory=true'])('고객 댓글 입력창을 숨긴다 (진입: %s)', (query) => {
    state.query = query;
    mount();
    expect(screen.queryByPlaceholderText('댓글을 입력하세요')).toBeNull();
    expect(screen.queryByText('컨설팅 답변하기')).toBeNull();
    expect(requests).toHaveLength(0);
  });
  it('고객의 등록·대댓글·수정 핸들러를 호출해도 요청하지 않는다', async () => {
    vi.useFakeTimers();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(
      () => useHairConsultationCommentFormState({ hairConsultationId: '42', receiverId: '88' }),
      { wrapper },
    );
    const onSuccess = vi.fn();
    act(() => result.current.handlers.handleReplyClick(12));
    expect(result.current.commentFormState.state).toBe('create');
    act(() =>
      result.current.handlers.handleEditComment(12, [
        {
          id: 12,
          content: '기존 댓글',
          isVisibleToModel: false,
          createdAt: '2026-11-03',
          user: { userId: 77, displayName: '고객', profilePictureURL: null },
        },
      ]),
    );
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(result.current.commentFormState.state).toBe('create');
    await act(async () =>
      result.current.handlers.handleCommentFormSubmit(
        { content: '새 댓글', parentCommentId: null, isVisibleToModel: false },
        { onSuccess },
      ),
    );
    expect(requests).toHaveLength(0);
    expect(onSuccess).not.toHaveBeenCalled();
  });
  it('디자이너의 일반댓글은 실제 상세 입력창에서 기존 API로 등록한다', async () => {
    state.model = false;
    mount();
    fireEvent.click(screen.getByRole('button', { name: '일반댓글' }));
    const input = screen.getByPlaceholderText('댓글을 입력하세요');
    fireEvent.change(input, { target: { value: '디자이너 댓글입니다' } });
    const submit = within(input.closest('form')!).getByRole('button');
    await waitFor(() => expect((submit as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(submit);
    await waitFor(() =>
      expect(requests).toEqual([
        {
          path: '/api/v1/hair-consultations/42/comments',
          method: 'POST',
          body: { content: '디자이너 댓글입니다' },
        },
      ]),
    );
    await waitFor(() => expect((input as HTMLTextAreaElement).value).toBe(''));
  });
  it('디자이너의 컨설팅 답변 작성 진입을 유지한다', () => {
    state.model = false;
    mount();
    fireEvent.click(screen.getByRole('button', { name: '컨설팅 답변하기' }));
    expect(state.push).toHaveBeenCalledWith('/posts/42/consulting/create', {
      postListTab: 'latest',
    });
    expect(requests).toHaveLength(0);
  });
  it('구버전 앱의 postId=0 작성 진입을 그대로 유지한다', () => {
    state.postId = '0';
    mount();
    expect(state.push).toHaveBeenCalledWith('/posts/create');
    expect(screen.queryByPlaceholderText('댓글을 입력하세요')).toBeNull();
  });
});
