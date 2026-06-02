import { afterEach, describe, expect, it, vi } from 'vitest';

describe('brandRegistry startup validation', () => {
  afterEach(() => {
    vi.doUnmock('./26do-hair');
    vi.resetModules();
  });

  it('신규 브랜드 코드를 정적으로 등록한다', async () => {
    vi.resetModules();

    const { brandRegistry } = await import('./index');

    expect(brandRegistry['26do-hair'].brandCode).toBe('T0710');
    expect(brandRegistry['visual-salon'].brandCode).toBe('V7452');
    expect(brandRegistry.amton.brandCode).toBe('A1402');
  });

  it('null이 아닌 브랜드 코드가 비어 있으면 import 시점에 실패한다', async () => {
    vi.resetModules();
    vi.doMock('./26do-hair', () => ({
      twentySixDoHairConfig: {
        slug: '26do-hair',
        name: '26도헤어',
        displayName: '26도헤어 헤어컨설팅',
        brandCode: '  ',
        logo: {},
        smallLogo: {},
        theme: {},
        features: { chat: false, mong: false, growthPass: false },
      },
    }));

    await expect(import('./index')).rejects.toThrow(
      '[BrandRegistry] 브랜드 코드가 설정되지 않은 브랜드가 등록됨: 26do-hair',
    );
  });
});
