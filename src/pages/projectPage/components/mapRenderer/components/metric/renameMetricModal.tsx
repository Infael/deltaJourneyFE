import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { renameMetricCommand } from "@/lib/project/commands/metricCommands/renameMetricCommand";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom } from "jotai";
import { FC } from "react";
import { z } from "zod";

interface RenameMetricModalProps {
  metricId: string;
  metricName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const RenameMetricModal: FC<RenameMetricModalProps> = ({ metricId, metricName, open, setOpen }) => {
  const [, updateProject] = useAtom(projectWriteAtom);

  const form = useAppForm({
    defaultValues: {
      metricName: metricName,
    },
    validators: {
      onChange: z.object({
        metricName: z.string().min(1, "Metric name is required").max(64, "Metric name is too long"),
      }),
    },
    onSubmit: (values) => {
      updateProject((prev) => {
        const newProject = renameMetricCommand(prev.project, {
          metricId: metricId,
          versionId: prev.actualShowedVersion,
          name: values.value.metricName,
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
          <DialogTitle>Rename Metric</DialogTitle>
          <DialogDescription className="hidden">Dialog for renaming metric</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.AppField name="metricName">
            {(field) => <field.TextField label="Enter the new name for metric:" />}
          </form.AppField>

          <Button type="submit" className="w-full">
            Rename
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
