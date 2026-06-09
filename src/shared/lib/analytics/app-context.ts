import { SEARCH_PARAMS } from '@/shared/constants/search-params';

import type { AnalyticsEntrySource, AnalyticsRuntimeContext } from './types';

type BridgeWindow = Window & {
  GoAppRouter?: {
    postMessage: (value: string) => void;
  };
  GoBack?: {
    postMessage: (value: string) => void;
  };
};

export function resolveAnalyticsEntrySource(searchParams: URLSearchParams): AnalyticsEntrySource {
  return searchParams.get(SEARCH_PARAMS.SOURCE) === 'app' ? 'flutter_app' : 'web';
}

export function hasNativeAppBridge(): boolean {
  if (typeof window === 'undefined') return false;

  const bridgeWindow = window as BridgeWindow;

  return (
    typeof bridgeWindow.GoAppRouter?.postMessage === 'function' ||
    typeof bridgeWindow.GoBack?.postMessage === 'function'
  );
}

export function resolveAnalyticsRuntimeContext(
  searchParams: URLSearchParams,
): AnalyticsRuntimeContext {
  if (resolveAnalyticsEntrySource(searchParams) === 'flutter_app' || hasNativeAppBridge()) {
    return 'flutter_webview';
  }

  return 'web_browser';
}

export function resolveInitialUserId(searchParams: URLSearchParams): string | null {
  return searchParams.get(SEARCH_PARAMS.USER_ID)?.trim() || null;
}
