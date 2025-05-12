import { v4 as uuidv4 } from "uuid";
import { Project, ProjectVersion } from "../models/project";

export const createEmptyVersion = (): ProjectVersion => ({
  id: uuidv4(),
  name: "Version 1",
  // start date is today minus 1 month by default
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
  endDate: new Date().toISOString(),
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
    versions: [],
  };
};

export const projectFromJSON = (project: string): Project => {
  return JSON.parse(project);
};

export const projectToJSON = (project: Project): string => {
  return JSON.stringify(project);
};
