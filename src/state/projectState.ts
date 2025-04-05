import { File } from "@/api/driveApi/drive-api.schemas";
import { atom } from "jotai";

interface ProjectState {
  project: object;
  projectMetadata: Pick<Required<File>, "id" | "name" | "createdTime" | "modifiedTime" | "owners">;
  projectStorage: "drive" | "local";
}

export const initialProjectState: ProjectState = {
  project: {},
  projectMetadata: {
    id: "",
    name: "",
    createdTime: "",
    modifiedTime: "",
    owners: [],
  },
  projectStorage: "drive",
};

export const projectAtom = atom<ProjectState>(initialProjectState);
