import { MetricType } from "@/lib/project/models/metrics";
import { Project } from "@/lib/project/models/project";

interface CommandData {
  metricId: string;
  touchpointId: string;
  value: number;
  versionId: string;
}

export const updateExperienceMetricValueCommand = (project: Project, data: CommandData) => {
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
  // locate correct metric
  let metricData = project.versions[versionIndex].touchpoints[touchpointIndex].metricsData.find(
    (metric) => metric.id === data.metricId,
  );

  // metric not found so we create it
  metricData ??= {
    id: data.metricId,
    key: MetricType.EXPERIENCE,
    value: data.value,
  };

  // update metric value
  if (metricData.key === MetricType.EXPERIENCE) {
    metricData.value = data.value;
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
          metricData,
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
