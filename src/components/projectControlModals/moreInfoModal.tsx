import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/paragraph";
import { FC } from "react";

interface MoreInfoModalProps {
  projectName: string;
  createdAt: string;
  lastModified: string;
  owners: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const MoreInfoModal: FC<MoreInfoModalProps> = ({
  projectName,
  createdAt,
  lastModified,
  owners,
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Info</DialogTitle>
          <DialogDescription className="hidden">Dialog with info about the project</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Project Name:</Paragraph>
            <Paragraph>{projectName}</Paragraph>
          </div>
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Created At:</Paragraph>
            <Paragraph>
              {new Date(createdAt).toLocaleString("sk-SK", {
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
              {new Date(lastModified).toLocaleString("sk-SK", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Paragraph>
          </div>
          <div className="flex flex-row justify-between">
            <Paragraph className="text-gray-400">Owners:</Paragraph>
            <Paragraph>{owners.join(", ")}</Paragraph>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
