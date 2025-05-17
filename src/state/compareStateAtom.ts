import { ProjectVersion } from "@/lib/project/models/project";
import { atom } from "jotai";
import { projectAtom } from "./projectAtom";
import { viewAtom } from "./viewAtom";

interface CompareState {
  activated: boolean;
  currentVersionColor: string;
  selectedVersion: ProjectVersion | null;
  selectedVersionColor: string;
}

export const initialCompareState: CompareState = {
  activated: false,
  currentVersionColor: "#8ae1f6",
  selectedVersion: null,
  selectedVersionColor: "#fcde98",
};

export const compareStateAtom = atom<CompareState>(initialCompareState);

export const resetCompareStateAtom = atom(null, (_, set) => {
  set(compareStateAtom, { ...initialCompareState });
  set(viewAtom, (prev) => ({
    ...prev,
    editable: true,
  }));
});

export const activateCompareStateAtom = atom(null, (get, set, selectedVersionId: string) => {
  const { current: project } = get(projectAtom);
  const selectedVersion = project.project.versions.find((version) => version.id === selectedVersionId) ?? null;

  if (!selectedVersion) {
    throw new Error("Selected version not found");
  }

  set(compareStateAtom, (prev) => ({ ...prev, activated: true, selectedVersion }));
  set(viewAtom, (prev) => ({
    ...prev,
    editable: false,
  }));
});
