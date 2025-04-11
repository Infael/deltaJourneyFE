import { Project } from "../models/project";
import { ProjectCommand } from "./projectCommand";

interface CommandData {
  newWidth: number;
  versionId: string;
  touchpointId: string;
}

export class ResizeTouchpointProjectCommand implements ProjectCommand<CommandData> {
  execute(project: Project, data: CommandData): Project {
    const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
    if (versionIndex === -1) {
      throw new Error("Version not found");
    }

    const updatedTouchpoint = project.versions[versionIndex].touchpoints.map((metric) => {
      if (metric.id === data.touchpointId) {
        return {
          ...metric,
          width: data.newWidth,
        };
      }
      return metric;
    });
    const updatedVersion = {
      ...project.versions[versionIndex],
      touchpoints: updatedTouchpoint,
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
