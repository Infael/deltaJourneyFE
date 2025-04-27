import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteVersionCommand } from "@/lib/project/commands/versionCommands/deleteVersionCommand";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom } from "jotai";
import { FC } from "react";

interface DeleteVersionModal {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteVersionModal: FC<DeleteVersionModal> = ({ open, setOpen }) => {
  const [, updateProject] = useAtom(projectWriteAtom);

  const handleDelete = () => {
    updateProject((prev) => deleteVersionCommand(prev));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete current version?</DialogTitle>
          <DialogDescription className="hidden">Dialog for deleting the current version</DialogDescription>
        </DialogHeader>
        <Button variant="danger" className="w-full" onClick={handleDelete}>
          Delete
        </Button>
        <DialogClose asChild>
          <Button variant="neutral" className="w-full">
            cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
