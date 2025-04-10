import { Project } from "../models/project";

export class CreateNewVersionProjectCommand {
  execute(project: Project, data: { name: string }): Project {
    const newVersion = {
      id: crypto.randomUUID(),
      name: data.name,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      description: "",
      metrics: [],
      touchpoints: [],
    };

    return {
      ...project,
      versions: [...project.versions, newVersion],
      modifiedTime: new Date().toISOString(),
    };
  }
}
