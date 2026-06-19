import { describe, expect, it } from 'vitest';

import { getBrandNameByReference } from './get-brand-name-by-reference';

describe('getBrandNameByReference', () => {
  it('brandIds에 매칭되는 첫 브랜드명을 반환한다', () => {
    const brandIdMap = new Map([
      [1, '보그헤어'],
      [2, '비주얼살롱'],
    ]);

    expect(getBrandNameByReference({ brandIds: [2, 1], brandIdMap })).toBe('비주얼살롱');
  });

  it('brandIds가 없으면 brands의 id로 브랜드명을 찾는다', () => {
    const brandIdMap = new Map([[1, '보그헤어']]);

    expect(getBrandNameByReference({ brands: [{ id: 1 }], brandIdMap })).toBe('보그헤어');
  });

  it('brandIds가 비어 있으면 brands의 id로 브랜드명을 찾는다', () => {
    const brandIdMap = new Map([[1, '보그헤어']]);

    expect(getBrandNameByReference({ brandIds: [], brands: [{ id: 1 }], brandIdMap })).toBe(
      '보그헤어',
    );
  });

  it('브랜드 참조가 없으면 fallback 브랜드명을 반환한다', () => {
    expect(
      getBrandNameByReference({
        brandIdMap: new Map(),
        fallbackBrandName: '미몽',
      }),
    ).toBe('미몽');
  });

  it('브랜드 참조가 있지만 아직 매핑되지 않았으면 fallback을 쓰지 않는다', () => {
    expect(
      getBrandNameByReference({
        brands: [{ id: 99 }],
        brandIdMap: new Map(),
        fallbackBrandName: '미몽',
      }),
    ).toBeUndefined();
  });
});
