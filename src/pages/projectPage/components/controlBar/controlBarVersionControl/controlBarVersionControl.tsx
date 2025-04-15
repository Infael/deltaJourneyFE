import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectAtom } from "@/state/projectAtom";
import { useAtom } from "jotai";
import { useState } from "react";
import { NewVersionModal } from "./newVersionModal";

export const ControlBarVersionControl = () => {
  const [{ current }, setProject] = useAtom(projectAtom);

  const [newVersionModalOpen, setNewVersionModalOpen] = useState(false);

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
      <Button variant="noShadow" onClick={() => setNewVersionModalOpen(true)}>
        Create New Version
      </Button>
      <Button variant="noShadow">Compare with</Button>
      <NewVersionModal open={newVersionModalOpen} setOpen={setNewVersionModalOpen} />
    </div>
  );
};
