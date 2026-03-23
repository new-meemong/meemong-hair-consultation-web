import { brandRegistry, getBrandConfig, getBrandSelectionPayload } from './index';
import { describe, expect, it, vi } from 'vitest';

// PNG import는 Vitest에서 string을 반환해 StaticImageData Zod 검증이 실패하므로
// 모듈 전체를 mock해 실제 StaticImageData 형식({ src, width, height })으로 대체
vi.mock('./meemong', () => ({
  meemongConfig: {
    slug: 'meemong',
    name: '미몽',
    displayName: '미몽 헤어컨설팅',
    apiBrandId: null,
    logo: { src: { src: '/logos/meemong.png', width: 578, height: 134 }, width: 160, height: 37 },
    smallLogo: { src: { src: '/logos/meemong-small.png', width: 40, height: 40 } },
    theme: {},
    features: { chat: true, mong: true, growthPass: true },
  },
}));

vi.mock('./parkjun', () => ({
  parkjunConfig: {
    slug: 'parkjun',
    name: '박준뷰티랩',
    displayName: '박준 뷰티랩',
    apiBrandId: 1,
    logo: { src: { src: '/logos/parkjun.png', width: 288, height: 231 }, width: 120, height: 96 },
    smallLogo: { src: { src: '/logos/parkjun-small.png', width: 40, height: 40 } },
    theme: { colorCautionary: '#C8A97E' },
    features: { chat: false, mong: false, growthPass: false },
  },
}));

describe('getBrandConfig', () => {
  it('유효한 slug(meemong)는 BrandConfig를 반환한다', () => {
    const config = getBrandConfig('meemong');
    expect(config).not.toBeNull();
    expect(config?.slug).toBe('meemong');
    expect(config?.apiBrandId).toBeNull();
  });

  it('유효한 slug(parkjun)는 BrandConfig를 반환한다', () => {
    const config = getBrandConfig('parkjun');
    expect(config).not.toBeNull();
    expect(config?.slug).toBe('parkjun');
    expect(config?.apiBrandId).toBe(1);
  });

  it('미등록 slug는 null을 반환한다', () => {
    expect(getBrandConfig('unknown')).toBeNull();
    expect(getBrandConfig('api')).toBeNull();
    expect(getBrandConfig('posts')).toBeNull();
  });

  it('빈 문자열/null/undefined는 null을 반환한다', () => {
    expect(getBrandConfig('')).toBeNull();
    expect(getBrandConfig(null)).toBeNull();
    expect(getBrandConfig(undefined)).toBeNull();
  });

  it('프로토타입 키(toString 등)는 null을 반환한다', () => {
    expect(getBrandConfig('toString')).toBeNull();
    expect(getBrandConfig('constructor')).toBeNull();
    expect(getBrandConfig('__proto__')).toBeNull();
  });
});

describe('getBrandSelectionPayload', () => {
  it('meemong(apiBrandId=null)은 ALL 타입을 반환한다', () => {
    const config = getBrandConfig('meemong')!;
    const payload = getBrandSelectionPayload(config);
    expect(payload).toEqual({ brandSelectionType: 'ALL' });
  });

  it('parkjun(apiBrandId=1)은 BRAND 타입과 brandIds를 반환한다', () => {
    const config = getBrandConfig('parkjun')!;
    const payload = getBrandSelectionPayload(config);
    expect(payload).toEqual({ brandSelectionType: 'BRAND', brandIds: [1] });
  });
});

describe('BrandConfig 검증', () => {
  it('모든 등록 브랜드의 consultationFlowOverride가 없거나 유효한 StepId[]이다', () => {
    for (const [slug, config] of Object.entries(brandRegistry)) {
      const result = getBrandConfig(slug);
      expect(result).not.toBeNull();
      if (result?.consultationFlowOverride) {
        expect(result.consultationFlowOverride.length).toBeGreaterThan(0);
        const unique = new Set(result.consultationFlowOverride);
        expect(unique.size).toBe(result.consultationFlowOverride.length);
        void config; // suppress unused warning
      }
    }
  });

  it('모든 등록 브랜드의 logo.src가 StaticImageData 형식이다', () => {
    for (const slug of Object.keys(brandRegistry)) {
      const config = getBrandConfig(slug)!;
      expect(typeof config.logo.src).toBe('object');
      expect(typeof config.logo.src.src).toBe('string');
    }
  });
});
