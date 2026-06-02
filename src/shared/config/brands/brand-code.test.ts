import { describe, expect, it } from 'vitest';

import { hasBrandCode } from './brand-code';

describe('hasBrandCode', () => {
  it.each([
    [null, false],
    ['', false],
    ['  ', false],
    ['VISUAL', true],
    [' VISUAL ', true],
  ])('브랜드 코드 %s의 설정 여부를 판별한다', (brandCode, expected) => {
    expect(hasBrandCode(brandCode)).toBe(expected);
  });
});
