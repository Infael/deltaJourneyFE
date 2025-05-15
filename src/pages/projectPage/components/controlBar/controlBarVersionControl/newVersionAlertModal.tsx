import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/useForm";
import { createNewVersionProjectCommand } from "@/lib/project/commands/versionCommands/createNewVersionProjectCommand";
import { projectAtom } from "@/state/projectAtom";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { z } from "zod";

interface NewVersionAlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NewVersionAlertModal: FC<NewVersionAlertModalProps> = ({ open, setOpen }) => {
  const project = useAtomValue(projectAtom);
  const [, updateProject] = useAtom(projectWriteAtom);

  const form = useAppForm({
    defaultValues: {
      name: `Version ${project.current.project.versions.length + 1} - ${new Date().toLocaleDateString()}`,
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      endDate: new Date(),
    },
    validators: {
      onChange: z
        .object({
          name: z.string().min(1, "Version name is required"),
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
    onSubmit: (data) => {
      updateProject((prev) => {
        const newProject = createNewVersionProjectCommand(prev.project, {
          name: data.value.name,
          startDate: data.value.startDate,
          endDate: data.value.endDate,
          createFrom: "empty",
        });
        return {
          ...prev,
          project: newProject,
          actualShowedVersion: newProject.versions[0].id,
        };
      });

      setOpen(false);
      form.reset();
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create first Version of your map</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="hidden">Dialog for creating first version of the map</AlertDialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <form.AppField name="name">
            {(field) => <field.TextField label="Enter the name for a new version:" />}
          </form.AppField>
          <form.AppField name="startDate">{(field) => <field.DateField label="Start date:" />}</form.AppField>
          <form.AppField name="endDate">{(field) => <field.DateField label="End date:" />}</form.AppField>

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
