import { Project } from "../../models/project";

interface CommandData {
  versionId: string;
  touchpointId: string;
  name: string;
}

export const updateTouchpointNotesCommand = (project: Project, data: CommandData): Project => {
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  // Update the notes of the touchpoint
  const updatedTouchpoints = project.versions[versionIndex].touchpoints.map((touchpoint) => {
    if (touchpoint.id === data.touchpointId) {
      return {
        ...touchpoint,
        notes: data.name,
        modifiedTime: new Date().toISOString(),
      };
    }
    return touchpoint;
  });

  const updatedVersion = {
    ...project.versions[versionIndex],
    touchpoints: updatedTouchpoints,
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
