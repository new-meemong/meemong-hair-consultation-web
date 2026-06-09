export type AnalyticsPrimitive = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsPrimitive | undefined>;
export type SanitizedAnalyticsProperties = Record<string, string | number | boolean>;

export type AnalyticsUserRole = 'model' | 'designer' | 'unknown';
export type AnalyticsUserType = 'MODEL' | 'DESIGNER' | 'UNKNOWN';
export type AnalyticsRuntimeContext = 'flutter_webview' | 'web_browser';
export type AnalyticsEntrySource = 'flutter_app' | 'web';

export type AnalyticsUserTraits = {
  user_id?: string;
  user_role?: AnalyticsUserRole;
  user_type?: AnalyticsUserType;
};

export type AnalyticsScreenInfo = {
  screenName: string;
  screenPathTemplate: string;
};
