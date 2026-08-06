import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ExperienceGroupFormValues } from '../../types/experience-group-form-values';
import useExperienceGroupForm from './use-experience-group-form';

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  replace: vi.fn(),
  saveContent: vi.fn(),
  showSnackBar: vi.fn(),
  showAdIfAllowed: vi.fn(),
  requestAdBeforeActionInApp: vi.fn(),
  closeAppWebView: vi.fn(),
  supportsNativePostCreateReturn: true,
}));

vi.mock('lottie-web', () => ({ default: {} }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) =>
      key === 'supportsNativePostCreateReturn' && mocks.supportsNativePostCreateReturn
        ? 'true'
        : null,
  }),
}));

vi.mock('@/shared', () => ({
  ROUTES: {
    POSTS: '/posts',
  },
}));

vi.mock('@/features/auth/context/auth-context', () => ({
  useAuthContext: () => ({ isUserModel: true }),
}));

vi.mock('@/shared/context/overlay-context', () => ({
  useOverlayContext: () => ({ showSnackBar: mocks.showSnackBar }),
}));

vi.mock('@/shared/hooks/use-router-with-user', () => ({
  useRouterWithUser: () => ({ replace: mocks.replace }),
}));

vi.mock('@/shared/hooks/use-writing-content', () => ({
  default: () => ({ saveContent: mocks.saveContent }),
}));

vi.mock('@/shared/lib/app-bridge', () => ({
  closeAppWebView: mocks.closeAppWebView,
}));

vi.mock('@/shared/lib/show-ad-if-allowed', () => ({
  showAdIfAllowed: mocks.showAdIfAllowed,
}));

vi.mock('@/shared/lib/request-ad-before-action-in-app', () => ({
  AD_BEFORE_ACTION_RESULT: {
    COMPLETED: 'completed',
    NOT_COMPLETED: 'notCompleted',
    UNSUPPORTED: 'unsupported',
  },
  requestAdBeforeActionInApp: mocks.requestAdBeforeActionInApp,
}));

vi.mock('../../api/use-create-experience-group-mutation', () => ({
  default: () => ({ mutate: mocks.mutate, isPending: false }),
}));

describe('useExperienceGroupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.supportsNativePostCreateReturn = true;
    mocks.requestAdBeforeActionInApp.mockResolvedValue('completed');
    mocks.closeAppWebView.mockReturnValue(true);
    mocks.mutate.mockImplementation(
      (
        _values: ExperienceGroupFormValues,
        options: { onSuccess: () => void; onError?: (error: unknown) => void },
      ) => {
        options.onSuccess();
      },
    );
  });

  it('신규 앱에서는 광고 완료 후 게시하고 작성 WebView를 닫아 하단 탭 목록으로 복귀한다', async () => {
    const { result } = renderHook(() => useExperienceGroupForm());

    await act(async () => {
      await result.current.submit({} as ExperienceGroupFormValues);
    });

    expect(mocks.requestAdBeforeActionInApp).toHaveBeenCalledWith({
      adType: 'creating-experience-group',
    });
    expect(mocks.requestAdBeforeActionInApp.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.mutate.mock.invocationCallOrder[0],
    );
    expect(mocks.saveContent).toHaveBeenCalledWith(null);
    expect(mocks.showSnackBar).toHaveBeenCalledWith({
      type: 'success',
      message: '업로드가 완료되었습니다!',
    });
    expect(mocks.closeAppWebView).toHaveBeenCalledWith('close');
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.showAdIfAllowed).not.toHaveBeenCalled();
  });

  it('네이티브 닫기 브리지가 없는 브라우저에서는 체험단 웹 목록으로 이동한다', async () => {
    mocks.closeAppWebView.mockReturnValueOnce(false);

    const { result } = renderHook(() => useExperienceGroupForm());

    await act(async () => {
      await result.current.submit({} as ExperienceGroupFormValues);
    });

    expect(mocks.replace).toHaveBeenCalledWith('/posts', {
      postTab: 'experienceGroup',
      postListTab: 'my',
    });
  });

  it('메인 WebView 안에서 열린 작성 화면은 닫지 않고 내 체험단 목록으로 교체한다', async () => {
    mocks.supportsNativePostCreateReturn = false;

    const { result } = renderHook(() => useExperienceGroupForm());

    await act(async () => {
      await result.current.submit({} as ExperienceGroupFormValues);
    });

    expect(mocks.closeAppWebView).not.toHaveBeenCalled();
    expect(mocks.replace).toHaveBeenCalledWith('/posts', {
      postTab: 'experienceGroup',
      postListTab: 'my',
    });
  });

  it('구버전 앱에서는 기존 계약대로 게시 성공 후 광고를 요청한다', async () => {
    mocks.requestAdBeforeActionInApp.mockResolvedValueOnce('unsupported');

    const { result } = renderHook(() => useExperienceGroupForm());

    await act(async () => {
      await result.current.submit({} as ExperienceGroupFormValues);
    });

    expect(mocks.mutate).toHaveBeenCalledOnce();
    expect(mocks.showAdIfAllowed).toHaveBeenCalledWith({
      adType: 'creating-experience-group',
    });
    expect(mocks.closeAppWebView).not.toHaveBeenCalled();
    expect(mocks.mutate.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.showAdIfAllowed.mock.invocationCallOrder[0],
    );
  });

  it('신규 앱에서 광고를 완료하지 못하면 게시하지 않고 오류 토스트를 표시한다', async () => {
    mocks.requestAdBeforeActionInApp.mockResolvedValueOnce('notCompleted');

    const { result } = renderHook(() => useExperienceGroupForm());

    await act(async () => {
      await result.current.submit({} as ExperienceGroupFormValues);
    });

    expect(mocks.mutate).not.toHaveBeenCalled();
    expect(mocks.showSnackBar).toHaveBeenCalledWith({
      type: 'error',
      message: '광고를 완료하지 못했습니다. 다시 시도해주세요.',
    });
  });

  it('SNS URL 서버 검증 실패 시 한국어 오류 토스트를 표시하고 작성 화면을 유지한다', async () => {
    mocks.mutate.mockImplementationOnce(
      (
        _values: ExperienceGroupFormValues,
        options: { onSuccess: () => void; onError?: (error: unknown) => void },
      ) => {
        options.onError?.({
          code: 'VALIDATOR_ERROR',
          message: 'validation error',
          httpCode: 400,
          fieldErrors: [
            {
              field: 'snsTypes.0.url',
              value: 'http://www.naver..com',
              reason: 'url must be a URL address',
            },
          ],
        });
      },
    );

    const { result } = renderHook(() => useExperienceGroupForm());

    await act(async () => {
      await result.current.submit({} as ExperienceGroupFormValues);
    });

    expect(mocks.showSnackBar).toHaveBeenCalledWith({
      type: 'error',
      message: '올바른 SNS 주소를 입력해주세요.',
    });
    expect(mocks.saveContent).not.toHaveBeenCalled();
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.showAdIfAllowed).not.toHaveBeenCalled();
  });

  it('기타 게시 실패 시 공통 오류 메시지를 토스트로 표시한다', async () => {
    mocks.mutate.mockImplementationOnce(
      (
        _values: ExperienceGroupFormValues,
        options: { onSuccess: () => void; onError?: (error: unknown) => void },
      ) => {
        options.onError?.({
          code: 'HTTP_ERROR',
          message: '게시글을 등록하지 못했습니다.',
          httpCode: 500,
        });
      },
    );

    const { result } = renderHook(() => useExperienceGroupForm());

    await act(async () => {
      await result.current.submit({} as ExperienceGroupFormValues);
    });

    expect(mocks.showSnackBar).toHaveBeenCalledWith({
      type: 'error',
      message: '게시글을 등록하지 못했습니다.',
    });
  });
});
