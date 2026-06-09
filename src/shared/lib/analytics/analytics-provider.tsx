'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useRef } from 'react';

import {
  resolveAnalyticsEntrySource,
  resolveAnalyticsRuntimeContext,
  resolveInitialUserId,
} from './app-context';
import { resolveAnalyticsScreen } from './route-screen';
import { analyticsService } from './service';

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const lastScreenKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    const routeSearchParams = new URLSearchParams(searchParamsKey);
    const screen = resolveAnalyticsScreen(pathname);
    const runtimeContext = resolveAnalyticsRuntimeContext(routeSearchParams);
    const entrySource = resolveAnalyticsEntrySource(routeSearchParams);
    const initialUserId = resolveInitialUserId(routeSearchParams);

    void (async () => {
      if (initialUserId) {
        await analyticsService.identify(initialUserId);
      }

      const screenKey = pathname;
      if (lastScreenKeyRef.current === screenKey) {
        return;
      }

      lastScreenKeyRef.current = screenKey;
      await analyticsService.screen(screen.screenName, {
        entry_source: entrySource,
        page_location:
          typeof window === 'undefined'
            ? screen.screenPathTemplate
            : `${window.location.origin}${screen.screenPathTemplate}`,
        page_path: screen.screenPathTemplate,
        runtime_context: runtimeContext,
        screen_path_template: screen.screenPathTemplate,
        screen_source: 'next_app_router',
      });
    })();
  }, [pathname, searchParamsKey]);

  return <>{children}</>;
}
