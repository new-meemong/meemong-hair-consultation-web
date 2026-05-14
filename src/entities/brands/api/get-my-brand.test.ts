import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createWebApiClient } from '@/shared/lib/web-api';

import { getMyBrand } from './get-my-brand';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock('@/shared/lib/web-api', () => ({
  createWebApiClient: vi.fn(() => ({
    get: mocks.get,
  })),
}));

const vogBrand = {
  id: 32,
  code: 'V2920',
  name: '보그헤어',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
};

describe('getMyBrand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('brands/me가 브랜드를 반환하면 그대로 사용한다', async () => {
    mocks.get.mockResolvedValueOnce(vogBrand);

    await expect(getMyBrand('token')).resolves.toEqual(vogBrand);

    expect(createWebApiClient).toHaveBeenCalledWith('token');
    expect(mocks.get).toHaveBeenCalledTimes(1);
    expect(mocks.get).toHaveBeenCalledWith('brands/me');
  });

  it('brands/me가 null이면 designers/me/my-page의 brand를 fallback으로 사용한다', async () => {
    mocks.get.mockResolvedValueOnce(null).mockResolvedValueOnce({ brand: vogBrand });

    await expect(getMyBrand('token')).resolves.toEqual(vogBrand);

    expect(mocks.get).toHaveBeenNthCalledWith(1, 'brands/me');
    expect(mocks.get).toHaveBeenNthCalledWith(2, 'designers/me/my-page');
  });

  it('fallback에도 브랜드가 없으면 null을 반환한다', async () => {
    mocks.get.mockResolvedValueOnce(null).mockResolvedValueOnce({ brand: null });

    await expect(getMyBrand('token')).resolves.toBeNull();
  });

  it('fallback 조회 실패는 브랜드 없음으로 처리한다', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mocks.get.mockResolvedValueOnce(null).mockRejectedValueOnce(new Error('network'));

    await expect(getMyBrand('token')).resolves.toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
