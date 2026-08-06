import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AD_COMPLETION_TIMEOUT_MS,
  AD_BEFORE_ACTION_RESULT,
  requestAdBeforeActionInApp,
} from './request-ad-before-action-in-app';

describe('requestAdBeforeActionInApp', () => {
  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(window, 'ShowAdBeforeAction');
    Reflect.deleteProperty(window, '__meemongResolveAdBeforeAction');
  });

  it('신규 앱 브리지가 없으면 구버전 fallback을 위해 unsupported를 반환한다', async () => {
    await expect(requestAdBeforeActionInApp({ adType: 'creating-experience-group' })).resolves.toBe(
      AD_BEFORE_ACTION_RESULT.UNSUPPORTED,
    );
  });

  it('네이티브 광고 완료 응답이 올 때까지 대기한 뒤 completed를 반환한다', async () => {
    const postMessage = vi.fn();
    window.ShowAdBeforeAction = { postMessage };

    const resultPromise = requestAdBeforeActionInApp({
      adType: 'creating-experience-group',
    });
    const request = JSON.parse(postMessage.mock.calls[0][0]) as {
      requestId: string;
      adType: string;
    };

    expect(request.adType).toBe('creating-experience-group');

    window.__meemongResolveAdBeforeAction?.({
      requestId: request.requestId,
      isCompleted: true,
    });

    await expect(resultPromise).resolves.toBe(AD_BEFORE_ACTION_RESULT.COMPLETED);
  });

  it('네이티브가 광고 미완료로 응답하면 업로드를 막을 수 있도록 notCompleted를 반환한다', async () => {
    const postMessage = vi.fn();
    window.ShowAdBeforeAction = { postMessage };

    const resultPromise = requestAdBeforeActionInApp({
      adType: 'creating-experience-group',
    });
    const request = JSON.parse(postMessage.mock.calls[0][0]) as { requestId: string };

    window.__meemongResolveAdBeforeAction?.({
      requestId: request.requestId,
      isCompleted: false,
    });

    await expect(resultPromise).resolves.toBe(AD_BEFORE_ACTION_RESULT.NOT_COMPLETED);
  });

  it('네이티브 응답이 유실되면 제한 시간 뒤 잠금을 해제할 수 있도록 notCompleted를 반환한다', async () => {
    vi.useFakeTimers();
    window.ShowAdBeforeAction = { postMessage: vi.fn() };

    const resultPromise = requestAdBeforeActionInApp({
      adType: 'creating-experience-group',
    });
    await vi.advanceTimersByTimeAsync(AD_COMPLETION_TIMEOUT_MS);

    await expect(resultPromise).resolves.toBe(AD_BEFORE_ACTION_RESULT.NOT_COMPLETED);
  });
});
