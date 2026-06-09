import type { AnalyticsProperties } from './types';

export const analyticsConfig = {
  amplitudeApiKey: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '11ec68514a0232f5c8c657847dc4c2c7',
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '67358144bc05dadfc30ca580f7c1b8f1',
  debug: process.env.NODE_ENV !== 'production',
  appSurface: 'hair_consultation_web',
  serviceArea: 'hair_consultation',
} as const;

export const baseAnalyticsProperties: AnalyticsProperties = {
  app_surface: analyticsConfig.appSurface,
  service_area: analyticsConfig.serviceArea,
};
