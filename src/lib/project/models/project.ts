import { MetricType } from "./metrics";

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

  metrics: Metric[];
  touchpoints: Touchpoint[];
}

export interface Metric {
  id: string;
  key: MetricType;
  label: string;
  height: number;
}

export interface Touchpoint {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  description: string;
  width: number;

  metrics: Metric[];
}
