import { Project } from "../../models/project";

interface CommandData {
  versionId: string;
  metricId: string;
  down: boolean;
}

export const moveMetricCommand = (project: Project, data: CommandData): Project => {
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  const metricIndex = project.versions[versionIndex].metrics.findIndex((metric) => metric.id === data.metricId);
  if (metricIndex === -1) {
    throw new Error("Metric not found");
  }
  // remove the metric from the current position
  const metricToMove = project.versions[versionIndex].metrics[metricIndex];
  const updatedMetrics = project.versions[versionIndex].metrics.filter((metric) => metric.id !== data.metricId);
  // find the new position
  const newPosition = data.down ? metricIndex + 1 : metricIndex - 1;
  // check if the new position is valid
  if (newPosition < 0 || newPosition >= project.versions[versionIndex].metrics.length) {
    throw new Error("Invalid position");
  }
  // insert the touchpoint at the new position
  updatedMetrics.splice(newPosition, 0, metricToMove);

  const updatedVersion = {
    ...project.versions[versionIndex],
    metrics: updatedMetrics,
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
