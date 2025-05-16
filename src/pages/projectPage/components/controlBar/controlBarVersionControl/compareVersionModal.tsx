import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/paragraph";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { activateCompareStateAtom } from "@/state/compareStateAtom";
import { projectAtom } from "@/state/projectAtom";
import { currentProjectVersionAtom } from "@/state/projectWriteAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC, useMemo, useState } from "react";

interface CompareVersionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CompareVersionModal: FC<CompareVersionModalProps> = ({ open, setOpen }) => {
  const { current: project } = useAtomValue(projectAtom);
  const currentVersion = useAtomValue(currentProjectVersionAtom);
  const [, activateCompareMode] = useAtom(activateCompareStateAtom);

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [noVersionSelected, setNoVersionSelected] = useState(false);

  const selectVersions = useMemo(
    () => project.project.versions.filter((version) => version.id !== currentVersion!.id),
    [project, currentVersion],
  );

  const handleCompare = () => {
    if (!selectedVersion) {
      setNoVersionSelected(true);
      return;
    }
    setNoVersionSelected(false);
    activateCompareMode(selectedVersion);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setSelectedVersion(null);
        setOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compare Versions</DialogTitle>
          <DialogDescription className="hidden">Compare two versions of the project</DialogDescription>
        </DialogHeader>
        <Paragraph size="small">
          Select version bellow to compare with the current showed version. This will open editor in a new view with
          both versions compared.
        </Paragraph>
        <Select
          value={selectedVersion ?? ""}
          onValueChange={(value) => {
            setSelectedVersion(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {selectVersions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {noVersionSelected && (
          <Paragraph className="0t-0 text-red-500" size="small">
            Please select a version to compare
          </Paragraph>
        )}
        <DialogFooter>
          <Button className="mt-4 w-full" onClick={handleCompare}>
            Compare
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
