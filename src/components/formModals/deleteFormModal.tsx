import { useDriveFilesDelete } from "@/api/driveApi/drive-api";
import { projectAtom } from "@/state/projectAtom";
import { deleteHistoryAtom, projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { FC } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface DeleteFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeleteFormModal: FC<DeleteFormModalProps> = ({ open, setOpen }) => {
  const { mutateAsync: deleteForm, isPending: isDeleting } = useDriveFilesDelete();

  const { current: project } = useAtomValue(projectAtom);
  const updateProject = useSetAtom(projectWriteAtom);
  const deleteHistory = useSetAtom(deleteHistoryAtom);

  const handleDelete = async () => {
    if (!project.project.formData?.id) {
      toast.error("No form to delete");
      return;
    }
    toast.promise(
      deleteForm(
        { fileId: project.project.formData.id },
        {
          onSuccess: () => {
            updateProject((prev) => ({
              ...prev,
              project: {
                ...prev.project,
                formData: undefined,
              },
            }));
            deleteHistory();
            setOpen(false);
          },
        },
      ),
      {
        loading: "Deleting form...",
        success: "Form deleted successfully",
        error: "Error deleting form",
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete form for this project?</DialogTitle>
          <DialogDescription>Your form will be deleted and all the responses will be lost!</DialogDescription>
        </DialogHeader>
        <Button variant="danger" className="w-full" disabled={isDeleting} onClick={handleDelete}>
          Delete
        </Button>
        <DialogClose asChild>
          <Button variant="neutral" className="w-full" disabled={isDeleting}>
            cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
