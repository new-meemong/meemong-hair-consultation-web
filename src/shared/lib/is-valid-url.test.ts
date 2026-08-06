import { describe, expect, it } from 'vitest';

import { isValidUrl } from './is-valid-url';

describe('isValidUrl', () => {
  it.each(['https://m.blog.naver.com/meemong', 'http://www.naver.com'])(
    'HTTP(S) URL을 허용한다: %s',
    (url) => {
      expect(isValidUrl(url)).toBe(true);
    },
  );

  it.each(['http://www.naver..com', 'www.naver.com', 'javascript:alert(1)', ''])(
    '서버에서 거부하거나 안전하지 않은 URL을 차단한다: %s',
    (url) => {
      expect(isValidUrl(url)).toBe(false);
    },
  );
});
