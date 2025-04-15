import { Project, ProjectVersion } from "../../models/project";

export type CreateNewVersionCommandCreateFrom = "empty" | "lastLayout" | "lastData";

interface CommandData {
  name: string;
  createFrom: CreateNewVersionCommandCreateFrom;
}

export const createNewVersionProjectCommand = (project: Project, data: CommandData): Project => {
  let newVersion: ProjectVersion;

  switch (data.createFrom) {
    case "empty":
      newVersion = {
        id: crypto.randomUUID(),
        name: data.name,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        description: "",
        metrics: [],
        touchpoints: [],
      };
      break;
    case "lastLayout":
      newVersion = {
        id: crypto.randomUUID(),
        name: data.name,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        description: "",
        metrics: project.versions[0].metrics,
        touchpoints: project.versions[0].touchpoints,
      };
      break;
    case "lastData":
      newVersion = {
        id: crypto.randomUUID(),
        name: data.name,
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        description: "",
        metrics: project.versions[0].metrics.map((metric) => ({
          ...metric,
          id: crypto.randomUUID(),
        })),
        touchpoints: project.versions[0].touchpoints.map((touchpoint) => ({
          ...touchpoint,
          id: crypto.randomUUID(),
        })),
      };
      break;
    default:
      throw new Error("Invalid createFrom option");
  }

  return {
    ...project,
    versions: [newVersion, ...project.versions],
    modifiedTime: new Date().toISOString(),
  };
};
