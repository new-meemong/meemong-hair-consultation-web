import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHook } from '@testing-library/react';
import { useOptionalBrand } from '@/shared/context/brand-context';
import useShowMongConsumeSheet from './use-show-mong-consume-sheet';

vi.mock('lottie-web', () => ({ default: {} }));
vi.mock('@/shared/ui/drawer', () => ({
  DrawerClose: ({ children }: { children: unknown }) => children,
  DrawerDescription: ({ children }: { children: unknown }) => children,
  DrawerFooter: () => null,
  DrawerHeader: ({ children }: { children: unknown }) => children,
  DrawerTitle: () => null,
}));
vi.mock('@/shared', () => ({
  Button: ({ children }: { children: unknown }) => children,
  ROUTES: {
    WEB_CONSULTING_RESPONSE: (slug: string, postId: string, responseId: string) =>
      `/${slug}/posts/${postId}/consulting/${responseId}`,
    POSTS_CONSULTING_RESPONSE: (postId: string, responseId: string) =>
      `/posts/${postId}/consulting/${responseId}`,
  },
}));

const mockPush = vi.fn();
const mockShowBottomSheet = vi.fn();

vi.mock('@/shared/context/brand-context', () => ({
  useOptionalBrand: vi.fn(),
}));

vi.mock('@/shared/context/overlay-context', () => ({
  useOverlayContext: () => ({ showBottomSheet: mockShowBottomSheet }),
}));

vi.mock('@/features/mong/api/use-get-mong-consume-presets', () => ({
  default: () => ({ data: undefined }),
}));

vi.mock('@/features/mong/api/use-get-mong-current', () => ({
  default: () => ({ data: undefined }),
}));

vi.mock('@/features/ad-block/hook/use-meemong-pass-policy', () => ({
  default: () => ({ canSkipMong: () => false }),
}));

vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ push: mockPush }),
}));

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockBrandConfig = {
  config: {
    slug: 'test-brand',
    name: 'Test Brand',
    displayName: 'Test Brand',
    brandCode: 'TESTBD',
    logo: { src: { src: '/logo.png', width: 100, height: 100 }, width: 100, height: 100 },
    smallLogo: { src: { src: '/small-logo.png', width: 50, height: 50 } },
    theme: {},
    features: { chat: false, mong: false, growthPass: false },
  },
};

describe('useShowMongConsumeSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('브랜드 웹에서는 바텀시트 없이 /{brand}/posts/{postId}/consulting/{responseId}로 이동한다', async () => {
    vi.mocked(useOptionalBrand).mockReturnValue(mockBrandConfig);

    const { result } = renderHook(() => useShowMongConsumeSheet());

    await result.current({
      designerName: '디자이너',
      answerId: 42,
      postId: 'post-1',
      postListTab: 'my',
    });

    expect(mockPush).toHaveBeenCalledWith(
      '/test-brand/posts/post-1/consulting/42',
      expect.anything(),
    );
    expect(mockShowBottomSheet).not.toHaveBeenCalled();
  });

  it('웹뷰 컨텍스트에서는 바텀시트를 표시한다', async () => {
    vi.mocked(useOptionalBrand).mockReturnValue(null);

    const { result } = renderHook(() => useShowMongConsumeSheet());

    await result.current({
      designerName: '디자이너',
      answerId: 42,
      postId: 'post-1',
      postListTab: 'my',
    });

    expect(mockShowBottomSheet).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
