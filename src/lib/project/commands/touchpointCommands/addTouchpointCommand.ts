import { Project, Touchpoint } from "../../models/project";

const DEFAULT_TOUCHPOINT_WIDTH = 142;

interface CommandData {
  name: string;
  versionId: string;
}

export const addTouchpointCommand = (project: Project, data: CommandData): Project => {
  const newTouchpoint: Touchpoint = {
    id: crypto.randomUUID(),
    name: data.name,
    createdTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    description: "",
    metricsData: [],
    width: DEFAULT_TOUCHPOINT_WIDTH,
  };

  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  const updatedVersion = {
    ...project.versions[versionIndex],
    touchpoints: [...project.versions[versionIndex].touchpoints, newTouchpoint],
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
