import { datadogRum } from '@datadog/browser-rum';
import { nextjsPlugin, onRouterTransitionStart } from '@datadog/browser-rum-nextjs';

import { APP_VERSION } from '@/shared/constants/app-version';

export { onRouterTransitionStart };

function getDatadogSampleRate(value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === '') return fallback;

  const sampleRate = Number(value);
  if (!Number.isFinite(sampleRate)) return fallback;

  return Math.min(100, Math.max(0, sampleRate));
}

const sessionSampleRate = getDatadogSampleRate(
  process.env.NEXT_PUBLIC_DATADOG_SESSION_SAMPLE_RATE,
  100,
);
const sessionReplaySampleRate = 100;

datadogRum.init({
  applicationId:
    process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID ?? '75003224-8535-4c1c-9692-59df5a3a3132',
  clientToken:
    process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN ?? 'pubb54d8685a10b1d2cc4e60ef880806aa5',
  site: 'datadoghq.com',
  service: 'meemong-hair-consultation-web',
  env:
    process.env.NEXT_PUBLIC_DATADOG_ENV ?? (process.env.NODE_ENV === 'production' ? 'prod' : 'dev'),
  version: APP_VERSION,
  sessionSampleRate,
  sessionReplaySampleRate,
  trackResources: true,
  trackUserInteractions: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
  plugins: [nextjsPlugin()],
});
