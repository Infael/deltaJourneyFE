import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { compareStateAtom, resetCompareStateAtom } from "@/state/compareStateAtom";
import { projectAtom } from "@/state/projectAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { CompareVersionModal } from "./compareVersionModal";
import { NewVersionModal } from "./newVersionModal";

export const ControlBarVersionControl = () => {
  const [{ current }, setProject] = useAtom(projectAtom);
  const view = useAtomValue(viewAtom);
  const compareState = useAtomValue(compareStateAtom);
  const [, resetCompareState] = useAtom(resetCompareStateAtom);

  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  if (compareState.activated) {
    return (
      <div className="flex gap-4">
        <Button variant="noShadow" onClick={resetCompareState}>
          Exit compare mode
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Select
        value={current.actualShowedVersion}
        onValueChange={(value) =>
          setProject((prev) => ({ ...prev, current: { ...prev.current, actualShowedVersion: value } }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Last Version" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {current.project.versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {!view.presentationMode && (
        <Button variant="noShadow" onClick={() => setNewVersionModalOpen(true)}>
          Create New Version
        </Button>
      )}
      <Button variant="noShadow" onClick={() => setCompareModalOpen(true)}>
        Compare with
      </Button>
      <NewVersionModal open={newVersionModalOpen} setOpen={setNewVersionModalOpen} />
      <CompareVersionModal open={compareModalOpen} setOpen={setCompareModalOpen} />
    </div>
  );
};
