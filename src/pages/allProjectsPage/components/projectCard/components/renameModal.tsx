import { getDriveFilesListQueryKey, useDriveFilesUpdate } from "@/api/driveApi/drive-api";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { FC } from "react";
import { z } from "zod";

interface RenameModalProps {
  projectId: string;
  projectName: string;
}

export const RenameModal: FC<RenameModalProps> = ({ projectId, projectName }) => {
  const { mutateAsync: renameFile, isPending } = useDriveFilesUpdate();

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
      renameFile({
        fileId: projectId,
        data: {
          name: `${values.value.projectName}.dj`,
        },
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: getDriveFilesListQueryKey() });
      });
    },
  });

  return (
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
        <DialogClose asChild>
          <Button type="submit" className="w-full" disabled={isPending}>
            Rename
          </Button>
        </DialogClose>
      </form>
    </DialogContent>
  );
};
