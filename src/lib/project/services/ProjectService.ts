import { v4 as uuidv4 } from "uuid";
import { Project, ProjectVersion } from "../models/project";

export const createEmptyVersion = (): ProjectVersion => ({
  id: uuidv4(),
  name: "Version 1",
  createdTime: new Date().toISOString(),
  modifiedTime: new Date().toISOString(),
  description: "",
  metrics: [],
  touchpoints: [],
});

export const createEmptyProject = (name: string): Project => {
  return {
    id: uuidv4(),
    applicationVersion: import.meta.env.VITE_APP_VERSION,
    title: name,
    createdTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    description: "",
    versions: [createEmptyVersion()],
  };
};

export const projectFromJSON = (project: string): Project => {
  return JSON.parse(project);
};

export const projectToJSON = (project: Project): string => {
  return JSON.stringify(project);
};
