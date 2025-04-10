import { Project } from "../models/project";

export interface ProjectCommand<T> {
  execute: (project: Project, data: T, callback?: () => void) => Project;
}
