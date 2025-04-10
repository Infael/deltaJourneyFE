import { MetricType } from "../models/metrics";
import { Metric, Project } from "../models/project";
import { ProjectCommand } from "./projectCommand";

interface CommandData {
  name: string;
  metricKey: MetricType;
  versionId: string;
}

export class AddMetricProjectCommand implements ProjectCommand<CommandData> {
  execute(project: Project, data: CommandData): Project {
    const newMetric: Metric = {
      label: data.name,
      key: data.metricKey,
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
  }
}
