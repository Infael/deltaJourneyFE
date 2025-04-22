import { Project } from "../../models/project";

interface CommandData {
  versionId: string;
  metricId: string;
  name: string;
}

export const renameMetricCommand = (project: Project, data: CommandData): Project => {
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  // Update the name of the metric
  const updatedMetric = project.versions[versionIndex].metrics.map((metric) => {
    if (metric.id === data.metricId) {
      return {
        ...metric,
        label: data.name,
        modifiedTime: new Date().toISOString(),
      };
    }
    return metric;
  });

  const updatedVersion = {
    ...project.versions[versionIndex],
    metrics: updatedMetric,
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
