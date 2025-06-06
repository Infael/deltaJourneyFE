import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { updateVersionCommand } from "@/lib/project/commands/versionCommands/updateVersionCommand";
import { currentProjectVersionAtom, projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { z } from "zod";

interface EditVersionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const EditVersionModal: FC<EditVersionModalProps> = ({ open, setOpen }) => {
  const [, updateProject] = useAtom(projectWriteAtom);
  const currentVersion = useAtomValue(currentProjectVersionAtom);

  const form = useAppForm({
    defaultValues: {
      versionName: currentVersion?.name ?? "",
      startDate: new Date(currentVersion?.startDate ?? new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(currentVersion?.endDate ?? new Date()),
    },
    validators: {
      onChange: z
        .object({
          versionName: z.string().min(1, "Version name is required").max(64, "Version name is too long"),
          startDate: z.date(),
          endDate: z.date(),
        })
        .refine(
          (data) => {
            return data.startDate < data.endDate;
          },
          {
            message: "Start date must be before end date",
            path: ["startDate"],
          },
        )
        .refine(
          (data) => {
            return data.startDate < data.endDate;
          },
          {
            message: "Start date must be before end date",
            path: ["endDate"],
          },
        ),
    },
    onSubmit: (values) => {
      updateProject((prev) =>
        updateVersionCommand(prev, {
          name: values.value.versionName,
          startDate: values.value.startDate,
          endDate: values.value.endDate,
        }),
      );
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Version</DialogTitle>
          <DialogDescription className="hidden">Dialog for editing current Version</DialogDescription>
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
          <form.AppField name="startDate">{(field) => <field.DateField label="Start date:" />}</form.AppField>
          <form.AppField name="endDate">{(field) => <field.DateField label="End date:" />}</form.AppField>

          <Button type="submit" className="w-full">
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
