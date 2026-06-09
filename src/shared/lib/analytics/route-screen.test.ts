import { describe, expect, test } from 'vitest';

import { resolveAnalyticsScreen } from './route-screen';

describe('resolveAnalyticsScreen', () => {
  test('maps webview post detail without exposing the post id', () => {
    expect(resolveAnalyticsScreen('/posts/12345')).toEqual({
      screenName: 'hair_consultation_post_detail',
      screenPathTemplate: '/posts/:postId',
    });
  });

  test('maps webview chat detail without exposing the channel id', () => {
    expect(resolveAnalyticsScreen('/chat/hair-consultation/abc123')).toEqual({
      screenName: 'hair_consultation_chat_detail',
      screenPathTemplate: '/chat/hair-consultation/:id',
    });
  });

  test('maps brand web routes with a brand slug template', () => {
    expect(resolveAnalyticsScreen('/sample-brand/posts/88')).toEqual({
      screenName: 'hair_consultation_brand_post_detail',
      screenPathTemplate: '/:brandSlug/posts/:postId',
    });
  });
});
