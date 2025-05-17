import { ProjectState } from "@/state/projectAtom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isProjectState = (project: any): project is ProjectState => {
  return typeof project === "object" && project !== null;
};

export const formatDjProject = (project: object): ProjectState | null => {
  if (isProjectState(project)) {
    return project;
  }

  console.warn("Invalid project format", project);
  return null;
};
