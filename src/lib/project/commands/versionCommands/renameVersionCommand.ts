import { ProjectState } from "@/state/projectAtom";

interface CommandData {
  name: string;
  startDate: Date;
  endDate: Date;
}

export const renameVersionCommand = (project: ProjectState, data: CommandData): ProjectState => {
  const newProject = { ...project };

  const versionToRename = newProject.project.versions.find((version) => version.id === newProject.actualShowedVersion);

  if (versionToRename) {
    newProject.project.versions = newProject.project.versions.map((version) => {
      if (version.id === versionToRename.id) {
        return {
          ...version,
          name: data.name,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
        };
      }
      return version;
    });
    newProject.project.versions[0].modifiedTime = new Date().toISOString();
  }

  return newProject;
};
