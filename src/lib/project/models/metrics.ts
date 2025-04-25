export interface BaseMetricData {
  id: string; // should be same as MetricInfo.id
  key: MetricType;
}

export interface TextMetricData extends BaseMetricData {
  key: MetricType.TEXT;
  value: string;
}

export enum MetricType {
  TEXT = "text",
}

export type MetricData = TextMetricData; // | OtherMetricData; aka discriminated union
