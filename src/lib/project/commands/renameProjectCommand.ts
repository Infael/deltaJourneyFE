import { Project } from "../models/project";
import { ProjectCommand } from "./projectCommand";

export class RenameProjectCommand implements ProjectCommand<{ name: string }> {
  execute(project: Project, data: { name: string }): Project {
    return {
      ...project,
      title: data.name,
      modifiedTime: new Date().toISOString(),
    };
  }
}
