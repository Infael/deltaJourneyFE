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

export enum MetricType {
  TEXT = "text",
  EXPERIENCE = "experience",
}

export type MetricData = TextMetricData | ExperienceMetricData; // | OtherMetricData; aka discriminated union
