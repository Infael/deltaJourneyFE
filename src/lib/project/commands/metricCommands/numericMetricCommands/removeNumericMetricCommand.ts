import { Project } from "@/lib/project/models/project";

interface CommandData {
  metricId: string;
  touchpointId: string;
  versionId: string;
}

export const removeNumericMetricValueCommand = (project: Project, data: CommandData) => {
  // locate correct version
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  // locate correct touchpoint
  const touchpointIndex = project.versions[versionIndex].touchpoints.findIndex(
    (touchpoint) => touchpoint.id === data.touchpointId,
  );
  if (touchpointIndex === -1) {
    throw new Error("Touchpoint not found");
  }

  // update version
  const updatedVersion = {
    ...project.versions[versionIndex],
    touchpoints: [
      ...project.versions[versionIndex].touchpoints.slice(0, touchpointIndex),
      {
        ...project.versions[versionIndex].touchpoints[touchpointIndex],
        metricsData: [
          ...project.versions[versionIndex].touchpoints[touchpointIndex].metricsData.filter(
            (metric) => metric.id !== data.metricId,
          ),
        ],
      },
      ...project.versions[versionIndex].touchpoints.slice(touchpointIndex + 1),
    ],
    modifiedTime: new Date().toISOString(),
  };

  return {
    ...project,
    versions: [...project.versions.slice(0, versionIndex), updatedVersion, ...project.versions.slice(versionIndex + 1)],
    modifiedTime: new Date().toISOString(),
  };
};
