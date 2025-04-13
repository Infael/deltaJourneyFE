import { Project } from "../models/project";

export const renameProjectCommand = (project: Project, data: { name: string }): Project => {
  return {
    ...project,
    title: data.name,
    modifiedTime: new Date().toISOString(),
  };
};
