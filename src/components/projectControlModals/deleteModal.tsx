import { getDriveFilesListQueryKey, useDriveFilesDelete } from "@/api/driveApi/drive-api";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";

interface DeleteModal {
  projectId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete?: () => void;
}

export const DeleteModal: FC<DeleteModal> = ({ projectId, open, setOpen, onDelete }) => {
  const { mutateAsync: deleteFile, isPending } = useDriveFilesDelete();

  const handleDelete = () => {
    deleteFile({ fileId: projectId })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: getDriveFilesListQueryKey() });
      })
      .finally(() => {
        setOpen(false);
        if (onDelete) {
          onDelete();
        }
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
          <DialogDescription className="hidden">Dialog for deleting the project</DialogDescription>
        </DialogHeader>
        <Button variant="danger" className="w-full" disabled={isPending} onClick={handleDelete}>
          Delete
        </Button>
        <DialogClose asChild>
          <Button variant="neutral" className="w-full" disabled={isPending}>
            cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
