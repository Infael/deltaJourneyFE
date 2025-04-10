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
  key: MetricType;
  label: string;
}

export interface Touchpoint {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  description: string;

  metrics: Metric[];
}
