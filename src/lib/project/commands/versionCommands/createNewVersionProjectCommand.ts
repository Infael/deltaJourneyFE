import { Project, ProjectVersion } from "../../models/project";
import { createEmptyVersion } from "../../services/ProjectService";

export type CreateNewVersionCommandCreateFrom = "empty" | "lastLayout" | "lastData";

interface CommandData {
  name: string;
  createFrom: CreateNewVersionCommandCreateFrom;
  startDate: Date;
  endDate: Date;
}

export const createNewVersionProjectCommand = (project: Project, data: CommandData): Project => {
  let newVersion: ProjectVersion;

  switch (data.createFrom) {
    case "empty":
      newVersion = {
        ...createEmptyVersion(),
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        name: data.name,
      };
      break;
    case "lastLayout":
      newVersion = {
        id: crypto.randomUUID(),
        name: data.name,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
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
          metricsData: [],
        })),
      };
      break;
    case "lastData":
      newVersion = {
        id: crypto.randomUUID(),
        name: data.name,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        createdTime: new Date().toISOString(),
        modifiedTime: new Date().toISOString(),
        description: "",
        metrics: project.versions[0].metrics.map((metric) => ({
          ...metric,
        })),
        touchpoints: project.versions[0].touchpoints.map((touchpoint) => ({
          ...touchpoint,
          metricsData: touchpoint.metricsData.map((metric) => ({
            ...metric,
          })),
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
