export interface BaseMetricData {
  id: string; // should be same as MetricInfo.id
  key: MetricType;
}

export interface TextMetricData extends BaseMetricData {
  key: MetricType.TEXT;
  value: string;
}

export interface ExperienceMetricData extends BaseMetricData {
  key: MetricType.EXPERIENCE;
  value: number;
}

export enum NumericMetricKey {
  GA = "ga",
  MANUAL = "manual",
}

export interface NumericMetricDataBase extends BaseMetricData {
  key: MetricType.NUMERIC;
  numericTypeKey: NumericMetricKey;
  value: number | null; // null if not fetched yet
  graphSettings: {
    color: string;
    hidden: boolean;
  };
  valueSettings: {
    color: string;
    hidden: boolean;
    prefix: string;
    suffix: string;
  };
}

export enum GAMetricType {
  ACTIVE_USERS = "activeUsers",
  NEW_USERS = "newUsers",
  ENGAGED_SESSIONS = "engagedSessions",
  ENGAGEMENT_RATE = "engagementRate",
  CONVERSIONS = "conversions",
  CONVERSION_RATE = "conversionRate",
  TOTAL_USERS = "totalUsers",
  SESSIONS = "sessions",
  BOUNCE_RATE = "bounceRate",
  AVERAGE_SESSION_DURATION = "averageSessionDuration",
  SCREEN_PAGE_VIEWS = "screenPageViews",
}

export interface GaNumericMetricData extends NumericMetricDataBase {
  numericTypeKey: NumericMetricKey.GA;
  gaProperties: {
    property: string;
    metric: GAMetricType;
  };
}

export interface ManualNumericMetricData extends NumericMetricDataBase {
  numericTypeKey: NumericMetricKey.MANUAL;
  manualProperties?: {
    range: {
      min: number;
      max: number;
    };
  };
}

export type NumericMetricData = GaNumericMetricData | ManualNumericMetricData;

export enum MetricType {
  TEXT = "text",
  EXPERIENCE = "experience",
  NUMERIC = "numeric",
}

export type MetricData = TextMetricData | ExperienceMetricData | NumericMetricData; // | OtherMetricData; aka discriminated union
