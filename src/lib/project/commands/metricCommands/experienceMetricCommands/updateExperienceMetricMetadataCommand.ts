import { MetricInfoExperience, Project } from "@/lib/project/models/project";

interface CommandData {
  versionId: string;
  updatedValues: MetricInfoExperience;
}

export const updateExperienceMetricMetadataCommand = (project: Project, data: CommandData) => {
  // locate correct version
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  // locate correct metric
  const metricIndex = project.versions[versionIndex].metrics.findIndex((metric) => metric.id === data.updatedValues.id);

  if (metricIndex === -1) {
    throw new Error("Metric not found");
  }

  // update version
  const updatedVersion = {
    ...project.versions[versionIndex],
    metrics: [
      ...project.versions[versionIndex].metrics.slice(0, metricIndex),
      data.updatedValues,
      ...project.versions[versionIndex].metrics.slice(metricIndex + 1),
    ],
    modifiedTime: new Date().toISOString(),
  };

  return {
    ...project,
    versions: [...project.versions.slice(0, versionIndex), updatedVersion, ...project.versions.slice(versionIndex + 1)],
    modifiedTime: new Date().toISOString(),
  };
};
