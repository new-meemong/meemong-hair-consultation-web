import * as amplitude from '@amplitude/analytics-browser';
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';

import { getFirebaseAnalytics } from '@/shared/lib/firebase';

import { analyticsConfig, baseAnalyticsProperties } from './config';
import { sanitizeAnalyticsProperties, toFirebaseUserProperties } from './properties';
import type {
  AnalyticsProperties,
  AnalyticsUserTraits,
  SanitizedAnalyticsProperties,
} from './types';

const MIXPANEL_URL_PROPERTY_BLACKLIST = [
  '$current_url',
  '$referrer',
  'current_url',
  'current_url_path',
  'current_url_protocol',
  'current_url_search',
  'current_page_title',
];

class WebAnalyticsService {
  private initPromise: Promise<void> | null = null;
  private identifiedUserId: string | null = null;
  private lastIdentifyKey: string | null = null;
  private superProperties = sanitizeAnalyticsProperties(baseAnalyticsProperties);

  init(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    this.initPromise ??= this.initVendors();
    return this.initPromise;
  }

  async identify(userId: string, traits: AnalyticsUserTraits = {}): Promise<void> {
    const normalizedUserId = userId.trim();
    if (!normalizedUserId) return;

    await this.init();

    const sanitizedTraits = sanitizeAnalyticsProperties(traits);
    const hasExplicitTraits = Object.keys(sanitizedTraits).length > 0;

    if (this.identifiedUserId === normalizedUserId && !hasExplicitTraits) {
      return;
    }

    const mergedTraits = sanitizeAnalyticsProperties({
      ...baseAnalyticsProperties,
      ...sanitizedTraits,
      user_id: normalizedUserId,
    });
    this.identifiedUserId = normalizedUserId;
    this.superProperties = {
      ...this.superProperties,
      ...mergedTraits,
    };
    const identifyKey = stableAnalyticsPropertiesKey(mergedTraits);

    if (this.lastIdentifyKey === identifyKey) {
      return;
    }

    await Promise.allSettled([
      this.runSafely(() => {
        amplitude.setUserId(normalizedUserId);
        const identify = applyAmplitudeIdentifyTraits(new amplitude.Identify(), mergedTraits);
        void amplitude.identify(identify).promise;
      }),
      this.runSafely(() => {
        mixpanel.identify(normalizedUserId);
        mixpanel.register(mergedTraits);
        mixpanel.people.set(mergedTraits);
      }),
      this.runSafely(async () => {
        const analytics = await getFirebaseAnalytics();
        if (!analytics) return;

        setUserId(analytics, normalizedUserId);
        setUserProperties(analytics, toFirebaseUserProperties(mergedTraits));
      }),
    ]);
    this.lastIdentifyKey = identifyKey;
  }

  async screen(screenName: string, properties: AnalyticsProperties = {}): Promise<void> {
    await this.init();

    const mergedProperties = sanitizeAnalyticsProperties({
      ...this.superProperties,
      ...properties,
      screen_name: screenName,
    });

    await Promise.allSettled([
      this.runSafely(() => {
        amplitude.track('screen_viewed', mergedProperties);
      }),
      this.runSafely(() => {
        mixpanel.track('screen_viewed', mergedProperties);
      }),
      this.runSafely(async () => {
        const analytics = await getFirebaseAnalytics();
        if (!analytics) return;

        logEvent(analytics, 'screen_view', {
          firebase_screen: screenName,
          firebase_screen_class: screenName,
          ...mergedProperties,
        });
      }),
    ]);
  }

  async setUserProperties(traits: AnalyticsUserTraits): Promise<void> {
    const userId = this.identifiedUserId;

    if (userId) {
      await this.identify(userId, traits);
      return;
    }

    await this.init();
    const mergedTraits = sanitizeAnalyticsProperties({
      ...baseAnalyticsProperties,
      ...traits,
    });
    this.superProperties = {
      ...this.superProperties,
      ...mergedTraits,
    };

    await Promise.allSettled([
      this.runSafely(() => {
        const identify = applyAmplitudeIdentifyTraits(new amplitude.Identify(), mergedTraits);
        void amplitude.identify(identify).promise;
      }),
      this.runSafely(() => {
        mixpanel.register(mergedTraits);
        mixpanel.people.set(mergedTraits);
      }),
      this.runSafely(async () => {
        const analytics = await getFirebaseAnalytics();
        if (!analytics) return;

        setUserProperties(analytics, toFirebaseUserProperties(mergedTraits));
      }),
    ]);
  }

  private async initVendors(): Promise<void> {
    await Promise.allSettled([
      this.runSafely(() => {
        amplitude.init(analyticsConfig.amplitudeApiKey, {
          autocapture: {
            attribution: false,
            elementInteractions: false,
            fileDownloads: false,
            formInteractions: false,
            pageUrlEnrichment: false,
            pageViews: false,
            sessions: true,
          },
          defaultTracking: {
            attribution: false,
            fileDownloads: false,
            formInteractions: false,
            pageViews: false,
            sessions: true,
          },
          fetchRemoteConfig: false,
          minIdLength: 1,
        });
      }),
      this.runSafely(() => {
        mixpanel.init(analyticsConfig.mixpanelToken, {
          autocapture: false,
          debug: analyticsConfig.debug,
          property_blacklist: MIXPANEL_URL_PROPERTY_BLACKLIST,
          stop_utm_persistence: true,
          track_pageview: false,
        });
        mixpanel.register(this.superProperties);
      }),
      this.runSafely(async () => {
        await getFirebaseAnalytics();
      }),
    ]);
  }

  private async runSafely(operation: () => void | Promise<void>): Promise<void> {
    try {
      await operation();
    } catch (error) {
      if (analyticsConfig.debug) {
        console.warn('[analytics]', error);
      }
    }
  }
}

export const analyticsService = new WebAnalyticsService();

export type { SanitizedAnalyticsProperties };

function applyAmplitudeIdentifyTraits(
  identify: amplitude.Identify,
  traits: SanitizedAnalyticsProperties,
): amplitude.Identify {
  for (const [key, value] of Object.entries(traits)) {
    identify.set(key, value);
  }

  return identify;
}

function stableAnalyticsPropertiesKey(properties: SanitizedAnalyticsProperties): string {
  return JSON.stringify(
    Object.keys(properties)
      .sort()
      .map((key) => [key, properties[key]]),
  );
}
