import { MetricData, MetricType } from "./metrics";

export interface Project {
  id: string;
  applicationVersion: string;
  title: string;
  createdTime: string;
  modifiedTime: string;
  description: string;

  versions: ProjectVersion[];
  formData?: FormData;
}

export interface ProjectVersion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdTime: string;
  modifiedTime: string;
  description: string;
  metrics: MetricInfo[];
  touchpoints: Touchpoint[];
}

export interface FormData {
  id: string;
  responderUri: string;
  touchpointFormQuestions?: TouchpointFormQuestions[];
}

export interface TouchpointFormQuestions {
  touchpointId: string;
  experienceId: string;
  gainId: string;
  painId: string;
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

  notes: string;
  metricsData: MetricData[];
}
