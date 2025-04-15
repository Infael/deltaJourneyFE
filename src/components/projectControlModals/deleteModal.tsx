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
import { toast } from "sonner";

interface DeleteModal {
  projectId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete?: () => void;
}

export const DeleteModal: FC<DeleteModal> = ({ projectId, open, setOpen, onDelete }) => {
  const { mutateAsync: deleteFile, isPending } = useDriveFilesDelete();

  const handleDelete = () => {
    toast.promise(
      deleteFile(
        { fileId: projectId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getDriveFilesListQueryKey() });
          },
          onSettled: () => {
            setOpen(false);
            if (onDelete) {
              onDelete();
            }
          },
        },
      ),
      {
        loading: "Deleting project...",
        success: "Project deleted successfully",
        error: "Error deleting project",
      },
    );
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
