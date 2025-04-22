import { Project } from "../../models/project";

interface CommandData {
  versionId: string;
  metricId: string;
}

export const deleteMetricCommand = (project: Project, data: CommandData): Project => {
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  const updatedMetric = project.versions[versionIndex].metrics.filter((metric) => metric.id !== data.metricId);

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
