import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { renameVersionCommand } from "@/lib/project/commands/versionCommands/renameVersionCommand";
import { projectAtom } from "@/state/projectAtom";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { z } from "zod";

interface RenameVersionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RenameVersionModal: FC<RenameVersionModalProps> = ({ open, setOpen }) => {
  const [, updateProject] = useAtom(projectWriteAtom);
  const { current: project } = useAtomValue(projectAtom);

  const form = useAppForm({
    defaultValues: {
      versionName: project.project.versions.find((version) => version.id === project.actualShowedVersion)?.name ?? "",
    },
    validators: {
      onChange: z.object({
        versionName: z.string().min(1, "Version name is required").max(64, "Version name is too long"),
      }),
    },
    onSubmit: (values) => {
      updateProject((prev) => renameVersionCommand(prev, { name: values.value.versionName }));
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Version</DialogTitle>
          <DialogDescription className="hidden">Dialog for renaming current Version</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.AppField name="versionName">
            {(field) => <field.TextField label="Enter the new name for version:" />}
          </form.AppField>

          <Button type="submit" className="w-full">
            Rename
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
