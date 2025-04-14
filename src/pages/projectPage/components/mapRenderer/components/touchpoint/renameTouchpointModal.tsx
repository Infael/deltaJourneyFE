import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { renameTouchpointCommand } from "@/lib/project/commands/touchpointCommands/renameTouchpointCommand";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom } from "jotai";
import { FC } from "react";
import { z } from "zod";

interface RenameTouchpointModalProps {
  touchpointId: string;
  touchpointName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RenameTouchpointModal: FC<RenameTouchpointModalProps> = ({
  touchpointId,
  touchpointName,
  open,
  setOpen,
}) => {
  const [, updateProject] = useAtom(projectWriteAtom);

  const form = useAppForm({
    defaultValues: {
      touchpointName: touchpointName,
    },
    validators: {
      onChange: z.object({
        touchpointName: z.string().min(1, "Touchpoint name is required").max(64, "Touchpoint name is too long"),
      }),
    },
    onSubmit: (values) => {
      updateProject((prev) => {
        const newProject = renameTouchpointCommand(prev.project, {
          touchpointId: touchpointId,
          versionId: prev.actualShowedVersion,
          name: values.value.touchpointName,
        });

        return {
          ...prev,
          project: newProject,
        };
      });

      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Touchpoint</DialogTitle>
          <DialogDescription className="hidden">Dialog for renaming the touchpoint</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.AppField name="touchpointName">
            {(field) => <field.TextField label="Enter the new name for touchpoint:" />}
          </form.AppField>

          <Button type="submit" className="w-full">
            Rename
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
