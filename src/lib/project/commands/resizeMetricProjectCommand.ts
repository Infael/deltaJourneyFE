import { Project } from "../models/project";
import { ProjectCommand } from "./projectCommand";

interface CommandData {
  newHeight: number;
  versionId: string;
  metricId: string;
}

export class ResizeMetricProjectCommand implements ProjectCommand<CommandData> {
  execute(project: Project, data: CommandData): Project {
    const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
    if (versionIndex === -1) {
      throw new Error("Version not found");
    }

    const updatedMetrics = project.versions[versionIndex].metrics.map((metric) => {
      if (metric.id === data.metricId) {
        return {
          ...metric,
          height: data.newHeight,
        };
      }
      return metric;
    });
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
  }
}
