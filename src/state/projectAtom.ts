import { File } from "@/api/driveApi/drive-api.schemas";
import { Project } from "@/lib/project/models/project";
import { createEmptyProject } from "@/lib/project/services/ProjectService";
import { atom } from "jotai";

interface ProjectState {
  project: Project;
  projectMetadata: Pick<Required<File>, "id" | "name" | "createdTime" | "modifiedTime" | "owners">;
  projectStorage: "drive" | "local";
  actualShowedVersion: string;
}

export const initialProjectState: ProjectState = {
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

export const projectAtom = atom<ProjectState>(initialProjectState);
