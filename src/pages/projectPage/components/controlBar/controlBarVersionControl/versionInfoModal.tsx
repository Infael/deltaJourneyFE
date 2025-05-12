import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/paragraph";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { FC, useMemo } from "react";

interface VersionInfoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const VersionInfoModal: FC<VersionInfoModalProps> = ({ open, setOpen }) => {
  const project = useAtomValue(projectAtom);

  const currentVersion = useMemo(() => {
    return project.current.project.versions.find((version) => version.id === project.current.actualShowedVersion);
  }, [project]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Version Info</DialogTitle>
          <DialogDescription className="hidden">Dialog with info about the current version</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Name:</Paragraph>
            <Paragraph>{currentVersion?.name}</Paragraph>
          </div>
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Version measuring data from:</Paragraph>
            <Paragraph>
              {new Date(currentVersion?.startDate ?? "").toLocaleString("sk-SK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </Paragraph>
          </div>
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Version measuring data to:</Paragraph>
            <Paragraph>
              {new Date(currentVersion?.endDate ?? "").toLocaleString("sk-SK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </Paragraph>
          </div>
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Created At:</Paragraph>
            <Paragraph>
              {new Date(currentVersion?.createdTime ?? "").toLocaleString("sk-SK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Paragraph>
          </div>
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Last Modified:</Paragraph>
            <Paragraph>
              {new Date(currentVersion?.modifiedTime ?? "").toLocaleString("sk-SK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Paragraph>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
