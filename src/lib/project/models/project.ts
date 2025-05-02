import { MetricData, MetricType } from "./metrics";

export interface Project {
  id: string;
  applicationVersion: string;
  title: string;
  createdTime: string;
  modifiedTime: string;
  description: string;

  versions: ProjectVersion[];
}

export interface ProjectVersion {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  description: string;

  metrics: MetricInfo[];
  touchpoints: Touchpoint[];
}

export interface MetricInfoBase {
  id: string;
  key: MetricType;
  label: string;
  height: number;
}

export interface MetricInfoExperience extends MetricInfoBase {
  key: MetricType.EXPERIENCE;
  path: {
    color: string;
    curveSmoothness: number;
  };
  lines: {
    hidden: boolean;
    firstValue: number;
    secondValue: number;
  };
  emojis: {
    hidden: boolean;
    colors: boolean;
  };
}

export type MetricInfo = MetricInfoBase | MetricInfoExperience;

export interface Touchpoint {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  description: string;
  width: number;

  metricsData: MetricData[];
}
