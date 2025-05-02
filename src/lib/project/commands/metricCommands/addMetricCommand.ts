import { MetricType } from "../../models/metrics";
import { MetricInfo, Project } from "../../models/project";

const DEFAULT_METRIC_HEIGHT = 100;

interface CommandData {
  name: string;
  metricKey: MetricType;
  versionId: string;
}

export const addMetricCommand = (project: Project, data: CommandData): Project => {
  let newMetric: MetricInfo;
  switch (data.metricKey) {
    case MetricType.TEXT:
      newMetric = {
        id: crypto.randomUUID(),
        label: data.name,
        key: data.metricKey,
        height: DEFAULT_METRIC_HEIGHT,
      };
      break;
    case MetricType.EXPERIENCE:
      newMetric = {
        id: crypto.randomUUID(),
        label: data.name,
        key: data.metricKey,
        height: DEFAULT_METRIC_HEIGHT,
        path: {
          color: "#0000ff",
          curveSmoothness: 0.35,
        },
        lines: {
          hidden: false,
          firstValue: 0.33,
          secondValue: 0.66,
        },
        emojis: {
          hidden: false,
          colors: false,
        },
      };
      break;
    default:
      throw new Error("Invalid metric type");
  }

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
