import { ProjectState } from "@/state/projectAtom";

export const deleteVersionCommand = (project: ProjectState): ProjectState => {
  const newProject = { ...project };

  const versionToDelete = newProject.project.versions.find((version) => version.id === newProject.actualShowedVersion);

  if (versionToDelete) {
    newProject.project.versions = newProject.project.versions.filter((version) => version.id !== versionToDelete.id);

    newProject.actualShowedVersion = newProject.project.versions[0]?.id ?? "";
  }

  return newProject;
};
