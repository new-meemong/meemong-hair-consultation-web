import type { AnalyticsProperties, SanitizedAnalyticsProperties } from './types';

const MAX_PROPERTY_COUNT = 25;
const PROPERTY_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export function sanitizeAnalyticsProperties(
  properties: AnalyticsProperties,
): SanitizedAnalyticsProperties {
  const sanitized: SanitizedAnalyticsProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (Object.keys(sanitized).length >= MAX_PROPERTY_COUNT) break;
    if (!PROPERTY_NAME_PATTERN.test(key)) continue;
    if (value === undefined || value === null) continue;
    if (typeof value === 'number' && !Number.isFinite(value)) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function toFirebaseUserProperties(
  properties: SanitizedAnalyticsProperties,
): Record<string, string> {
  const firebaseProperties: Record<string, string> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (
      key === 'user_id' ||
      key === 'user_role' ||
      key === 'user_type' ||
      key === 'app_surface' ||
      key === 'service_area'
    ) {
      firebaseProperties[key] = String(value);
    }
  }

  return firebaseProperties;
}
