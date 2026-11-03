import type { ReactNode } from 'react';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CreatePostPage from '@/app/(webview)/posts/create/page';
import { useCreateHairConsultation } from '@/features/posts/hooks/use-create-hair-consultation';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '@/features/posts/constants/hair-consultation-form-default-values';
import { REQUIRED_MY_IMAGE_TYPES } from '@/features/posts/constants/my-image-type';
import type { HairConsultationFormValues } from '@/features/posts/types/hair-consultation-form-values';

const state = vi.hoisted(() => ({ postTab: 'consulting' }));
vi.mock('@/features/posts/hooks/use-post-tab', () => ({ usePostTab: () => [state.postTab] }));
vi.mock('@/features/auth/context/auth-context', () => ({
  useAuthContext: () => ({ isUserModel: true }),
}));
vi.mock('@/shared/context/brand-context', () => ({ useOptionalBrand: () => null }));
vi.mock('@/features/posts/hooks/use-onboarding-gate', () => ({
  default: () => ({ isOnboardingVisible: false }),
}));
vi.mock('@/shared/hooks/use-show-guide', () => ({ default: () => {} }));
vi.mock('@/features/posts/ui/hair-consultation-onboarding', () => ({ default: () => null }));
vi.mock('@/widgets/post/ui/consulting-post/hair-consultation-form-container', () => ({
  default: () => <p>새 상담글 작성폼</p>,
}));
vi.mock('@/widgets/post/ui/experience-group/experience-group-form-container', () => ({
  default: () => <p>체험단 신청폼</p>,
}));
// Image encoding is a browser boundary; retain the real upload and creation clients below.
vi.mock('@/shared/lib/resize-image-file', () => ({ resizeImageFile: async (file: File) => file }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
beforeEach(() => {
  state.postTab = 'consulting';
  localStorage.clear();
});

describe('레거시 앱의 기존 상담글 작성과 체험단 신청 유지', () => {
  it('기존 상담 작성 URL은 계속 작성폼을 표시한다', () => {
    render(<CreatePostPage />);
    expect(screen.getByText('새 상담글 작성폼')).toBeTruthy();
  });
  it('체험단 신청 페이지는 계속 표시한다', () => {
    state.postTab = 'experienceGroup';
    render(<CreatePostPage />);
    expect(screen.getByText('체험단 신청폼')).toBeTruthy();
  });
  it('레거시 고객의 사진 업로드와 새 상담글 제출은 기존 API로 완료된다', async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const requests: { path: string; method: string; body?: unknown }[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const request = input instanceof Request ? input : new Request(input, init);
        const url = new URL(request.url);
        if (url.hostname === 'uploads.example.com') {
          requests.push({ path: url.pathname, method: request.method });
          return new Response('', { status: 200 });
        }
        const body = request.method === 'POST' ? await request.json() : undefined;
        requests.push({ path: url.pathname, method: request.method, body });
        const data = url.pathname.endsWith('/presigned-url')
          ? {
              uploadData: {
                url: 'https://uploads.example.com',
                fields: { key: 'images/fixture.png' },
              },
              uploadUrlList: [],
              requestMethod: 'POST',
            }
          : { id: 55 };
        return new Response(JSON.stringify({ success: true, data }), {
          headers: { 'content-type': 'application/json' },
        });
      }),
    );
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useCreateHairConsultation(), { wrapper });
    const data: HairConsultationFormValues = {
      ...DEFAULT_HAIR_CONSULTATION_FORM_VALUES,
      title: '기존 앱에서 작성',
      content: '신규 웹을 거치지 않은 상담',
      hairConcerns: ['모발손상'],
      hairLength: '단발',
      hairTexture: '직모',
      skinBrightness: '22~23호',
      personalColor: '잘모름',
      desiredDateType: '협의 가능',
      treatments: [{ treatmentType: '커트/드라이만 했어요', monthsAgo: 1, isSelf: false }],
      aspirationImages: { images: [], description: '원하는 스타일 설명' },
      myImages: REQUIRED_MY_IMAGE_TYPES.map((type) => ({
        type,
        image: new File(['fixture'], type + '.png', { type: 'image/png' }),
      })),
    };
    const onError = vi.fn(),
      onSuccess = vi.fn();
    await act(() => result.current.handleCreateHairConsultation(data, { onError, onSuccess }));
    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalledWith({ id: 55 });
    expect(requests.filter((request) => request.path === '/')).toHaveLength(3);
    expect(requests.filter((request) => request.path === '/api/v1/hair-consultations')).toEqual([
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({ title: data.title, myImages: expect.any(Array) }),
      }),
    ]);
    client.clear();
  });
});
