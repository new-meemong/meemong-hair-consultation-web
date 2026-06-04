import { datadogRum } from '@datadog/browser-rum';

import type { UserData } from '@/shared/lib/auth';

export function syncDatadogUser(user: UserData, source: 'webview' | 'web' = 'webview') {
  const appUserId = String(user.id);

  datadogRum.setUser({
    id: appUserId,
    name: user.displayName || undefined,
    app_user_id: appUserId,
    role: String(user.role),
    source,
  });
}

export function clearDatadogUser() {
  datadogRum.clearUser();
}
