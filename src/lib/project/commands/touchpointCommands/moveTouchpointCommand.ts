import { Project } from "../../models/project";

interface CommandData {
  versionId: string;
  touchpointId: string;
  right: boolean;
}

export const moveTouchpointCommand = (project: Project, data: CommandData): Project => {
  const versionIndex = project.versions.findIndex((version) => version.id === data.versionId);
  if (versionIndex === -1) {
    throw new Error("Version not found");
  }

  const touchpointIndex = project.versions[versionIndex].touchpoints.findIndex(
    (touchpoint) => touchpoint.id === data.touchpointId,
  );
  if (touchpointIndex === -1) {
    throw new Error("Touchpoint not found");
  }
  // remove the touchpoint from the current position
  const touchpointToMove = project.versions[versionIndex].touchpoints[touchpointIndex];
  const updatedTouchpoints = project.versions[versionIndex].touchpoints.filter(
    (touchpoint) => touchpoint.id !== data.touchpointId,
  );
  // find the new position
  const newPosition = data.right ? touchpointIndex + 1 : touchpointIndex - 1;
  // check if the new position is valid
  if (newPosition < 0 || newPosition >= project.versions[versionIndex].touchpoints.length) {
    throw new Error("Invalid position");
  }
  // insert the touchpoint at the new position
  updatedTouchpoints.splice(newPosition, 0, touchpointToMove);

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
