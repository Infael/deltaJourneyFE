import { getDriveFilesListQueryKey, useDriveFilesUpdate } from "@/api/driveApi/drive-api";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { projectAtom } from "@/state/projectAtom";
import { useAtom } from "jotai";
import { FC } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface RenameModalProps {
  projectId: string;
  projectName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RenameModal: FC<RenameModalProps> = ({ projectId, projectName, open, setOpen }) => {
  const { mutateAsync: renameFile, isPending } = useDriveFilesUpdate();
  const [projectData, setProjectData] = useAtom(projectAtom);

  const form = useAppForm({
    defaultValues: {
      projectName: projectName,
    },
    validators: {
      onChange: z.object({
        projectName: z.string().min(1, "Project name is required"),
      }),
    },
    onSubmit: (values) => {
      if (projectData.current.projectStorage === "local") {
        setProjectData((prev) => ({
          ...prev,
          projectMetadata: {
            ...prev.current.projectMetadata,
            name: values.value.projectName,
          },
        }));
        setOpen(false);
        return;
      }
      toast.promise(
        renameFile({
          fileId: projectId,
          data: {
            name: `${values.value.projectName}.dj`,
          },
        })
          .then(() => {
            queryClient.invalidateQueries({ queryKey: getDriveFilesListQueryKey() });
            setProjectData((prev) => ({
              ...prev,
              projectMetadata: {
                ...prev.current.projectMetadata,
                name: values.value.projectName,
              },
            }));
          })
          .finally(() => {
            setOpen(false);
          }),
        {
          loading: "Renaming project...",
          success: "Project renamed successfully",
          error: "Error renaming project",
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          <DialogDescription className="hidden">Dialog for renaming the project</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.AppField name="projectName">
            {(field) => <field.TextField label="Enter the new name for your Project:" />}
          </form.AppField>

          <Button type="submit" className="w-full" disabled={isPending}>
            Rename
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
