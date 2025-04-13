import { Project } from "../../models/project";

interface CommandData {
  versionId: string;
  touchpointId: string;
}

export const deleteTouchpointCommand = (project: Project, data: CommandData): Project => {
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  const updatedTouchpoint = project.versions[versionIndex].touchpoints.filter(
    (touchpoint) => touchpoint.id !== data.touchpointId,
  );

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
};
