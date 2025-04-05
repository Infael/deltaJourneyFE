import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { FC } from "react";

import { NewProjectForm } from "./newProjectForm";

interface NewProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreate?: (newProjectId: string) => void;
}

export const NewProjectModal: FC<NewProjectModalProps> = ({ open, setOpen, onCreate }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Project</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">Dialog for creating new project</DialogDescription>
        <NewProjectForm
          onCreate={(newProjectId: string) => {
            setOpen(false);
            if (onCreate) {
              onCreate(newProjectId);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
