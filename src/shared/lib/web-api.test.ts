import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_TOKEN_EXPIRED_EVENT } from '@/shared/api/client';

import { createWebApiClient } from './web-api';

const mocks = vi.hoisted(() => ({
  kyCreate: vi.fn(),
}));

vi.mock('ky', () => ({
  default: {
    create: mocks.kyCreate,
  },
}));

describe('createWebApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('slug가 없어도 403이면 토큰 만료 이벤트를 dispatch한다', async () => {
    let beforeError!: (error: Error & { response?: Response; request?: Request }) => unknown;

    mocks.kyCreate.mockImplementation((options) => {
      beforeError = options.hooks.beforeError[0];
      return {};
    });

    createWebApiClient('token');

    const listener = vi.fn();
    window.addEventListener(AUTH_TOKEN_EXPIRED_EVENT, listener);

    const error = new Error('Forbidden') as Error & { response?: Response; request?: Request };
    error.response = new Response(JSON.stringify({ message: 'expired' }), { status: 403 });
    error.request = new Request('https://api.meemong.com/api/v1/brands/me');

    await beforeError(error);

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(AUTH_TOKEN_EXPIRED_EVENT, listener);
  });

  it('slug가 있으면 403에서 해당 브랜드 웹 세션을 삭제하고 토큰 만료 이벤트를 dispatch한다', async () => {
    let beforeError!: (error: Error & { response?: Response; request?: Request }) => unknown;

    mocks.kyCreate.mockImplementation((options) => {
      beforeError = options.hooks.beforeError[0];
      return {};
    });

    localStorage.setItem('web_user_data:vog', '{"token":"old"}');
    createWebApiClient('token', 'vog');

    const listener = vi.fn();
    window.addEventListener(AUTH_TOKEN_EXPIRED_EVENT, listener);

    const error = new Error('Forbidden') as Error & { response?: Response; request?: Request };
    error.response = new Response(JSON.stringify({ message: 'expired' }), { status: 403 });
    error.request = new Request('https://api.meemong.com/api/v1/brands/me');

    await beforeError(error);

    expect(localStorage.getItem('web_user_data:vog')).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(AUTH_TOKEN_EXPIRED_EVENT, listener);
  });
});
