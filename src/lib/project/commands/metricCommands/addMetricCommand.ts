import { MetricType } from "../../models/metrics";
import { Metric, Project } from "../../models/project";

const DEFAULT_METRIC_HEIGHT = 100;

interface CommandData {
  name: string;
  metricKey: MetricType;
  versionId: string;
}

export const addMetricCommand = (project: Project, data: CommandData): Project => {
  const newMetric: Metric = {
    id: crypto.randomUUID(),
    label: data.name,
    key: data.metricKey,
    height: DEFAULT_METRIC_HEIGHT,
  };

  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  const updatedVersion = {
    ...project.versions[versionIndex],
    metrics: [...project.versions[versionIndex].metrics, newMetric],
    modifiedTime: new Date().toISOString(),
  };
  const updatedVersions = [...project.versions];
  updatedVersions[versionIndex] = updatedVersion;
  return {
    ...project,
    versions: updatedVersions,
    modifiedTime: new Date().toISOString(),
  };
};
