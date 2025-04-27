import { ProjectState } from "@/state/projectAtom";
import { createEmptyVersion } from "../../services/ProjectService";

export const deleteVersionCommand = (project: ProjectState): ProjectState => {
  const newProject = { ...project };

  const versionToDelete = newProject.project.versions.find((version) => version.id === newProject.actualShowedVersion);

  if (versionToDelete) {
    newProject.project.versions = newProject.project.versions.filter((version) => version.id !== versionToDelete.id);
    if (newProject.project.versions.length <= 0) {
      newProject.project.versions.push(createEmptyVersion());
    }

    newProject.actualShowedVersion = newProject.project.versions[0].id;
  }

  return newProject;
};
