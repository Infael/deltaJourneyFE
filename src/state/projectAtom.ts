import { File } from "@/api/driveApi/drive-api.schemas";
import { Project } from "@/lib/project/models/project";
import { createEmptyProject } from "@/lib/project/services/ProjectService";
import { atom } from "jotai";

export interface ProjectState {
  project: Project;
  projectMetadata: Pick<Required<File>, "id" | "name" | "createdTime" | "modifiedTime" | "owners">;
  projectStorage: "drive" | "local";
  actualShowedVersion: string;
}

export const initialState: ProjectState = {
  project: createEmptyProject(""),
  projectMetadata: {
    id: "",
    name: "",
    createdTime: "",
    modifiedTime: "",
    owners: [],
  },
  projectStorage: "drive",
  actualShowedVersion: "",
};

export interface ProjectHistoryState {
  current: ProjectState;
  past: ProjectState[];
  future: ProjectState[];
}

export const initialProjectState: ProjectHistoryState = {
  current: initialState,
  past: [],
  future: [],
};

export const projectAtom = atom<ProjectHistoryState>(initialProjectState);
