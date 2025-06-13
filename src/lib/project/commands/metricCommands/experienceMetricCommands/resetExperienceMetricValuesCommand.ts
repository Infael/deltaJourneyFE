import { MetricType } from "@/lib/project/models/metrics";
import { Project } from "@/lib/project/models/project";

interface CommandData {
  metricId: string;
  versionId: string;
}

export const resetExperienceMetricValueCommand = (project: Project, data: CommandData) => {
  // locate correct version
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  // for each touchpoint, reset the metric value
  const updatedTouchpoints = project.versions[versionIndex].touchpoints.map((touchpoint) => {
    const metricIndex = touchpoint.metricsData.findIndex((metric) => metric.id === data.metricId);
    if (metricIndex === -1) {
      return touchpoint; // Metric not found, return touchpoint unchanged
    }
    // Reset the metric value to 50
    const updatedMetricsData = touchpoint.metricsData.map((metric, index) => {
      if (index === metricIndex && metric.key === MetricType.EXPERIENCE) {
        metric.value = 50;
      }
      return metric;
    });

    return {
      ...touchpoint,
      metricsData: updatedMetricsData,
    };
  });

  const updatedVersion = {
    ...project.versions[versionIndex],
    touchpoints: updatedTouchpoints,
  };

  return {
    ...project,
    versions: [...project.versions.slice(0, versionIndex), updatedVersion, ...project.versions.slice(versionIndex + 1)],
    modifiedTime: new Date().toISOString(),
  };
};
