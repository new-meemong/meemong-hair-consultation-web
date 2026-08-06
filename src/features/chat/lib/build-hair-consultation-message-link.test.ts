import { describe, expect, it } from 'vitest';

import { buildHairConsultationMessageLink } from './build-hair-consultation-message-link';

describe('buildHairConsultationMessageLink', () => {
  const localChatUrl =
    'http://192.168.4.100:3002/chat/hair-consultation/channel_1?userId=1&source=app';

  it('stores a production public link while testing against the production API', () => {
    expect(buildHairConsultationMessageLink(localChatUrl, 'https://api.meemong.com/')).toBe(
      'https://meemong-hair-consultation-web.vercel.app/chat/hair-consultation/channel_1',
    );
  });

  it('stores a test public link for non-production API environments', () => {
    expect(buildHairConsultationMessageLink(localChatUrl, 'https://api-test.meemong.com')).toBe(
      'https://meemong-hair-consultation-web-test.vercel.app/chat/hair-consultation/channel_1',
    );
  });

  it('removes query parameters and preserves an explicit fragment', () => {
    expect(
      buildHairConsultationMessageLink(
        'https://preview.vercel.app/posts/1?userId=1#answer',
        'https://api.meemong.com',
      ),
    ).toBe('https://meemong-hair-consultation-web.vercel.app/posts/1#answer');
  });

  it('uses the configured public web origin before the API-based fallback', () => {
    expect(
      buildHairConsultationMessageLink(
        localChatUrl,
        'https://api-test.meemong.com',
        'https://hair.meemong.com/some-path',
      ),
    ).toBe('https://hair.meemong.com/chat/hair-consultation/channel_1');
  });

  it('falls back safely when the configured web origin is invalid', () => {
    expect(
      buildHairConsultationMessageLink(localChatUrl, 'https://api.meemong.com', 'not-a-url'),
    ).toBe('https://meemong-hair-consultation-web.vercel.app/chat/hair-consultation/channel_1');
  });
});
