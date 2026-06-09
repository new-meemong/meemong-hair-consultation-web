import { describe, expect, it } from 'vitest';

import {
  resolveAnalyticsEntrySource,
  resolveAnalyticsRuntimeContext,
  resolveInitialUserId,
} from './app-context';

describe('analytics app context', () => {
  it('marks Flutter app webview entry from source query', () => {
    const searchParams = new URLSearchParams('source=app');

    expect(resolveAnalyticsEntrySource(searchParams)).toBe('flutter_app');
    expect(resolveAnalyticsRuntimeContext(searchParams)).toBe('flutter_webview');
  });

  it('uses web browser context by default', () => {
    const searchParams = new URLSearchParams();

    expect(resolveAnalyticsEntrySource(searchParams)).toBe('web');
    expect(resolveAnalyticsRuntimeContext(searchParams)).toBe('web_browser');
  });

  it('uses auth query user id as analytics user id', () => {
    const searchParams = new URLSearchParams('userId=auth-user');

    expect(resolveInitialUserId(searchParams)).toBe('auth-user');
  });
});
