import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import {
  CreateNewVersionCommandCreateFrom,
  createNewVersionProjectCommand,
} from "@/lib/project/commands/versionCommands/createNewVersionProjectCommand";
import { projectAtom } from "@/state/projectAtom";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC } from "react";
import { z } from "zod";

interface NewVersionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NewVersionModal: FC<NewVersionModalProps> = ({ open, setOpen }) => {
  const project = useAtomValue(projectAtom);
  const [, updateProject] = useAtom(projectWriteAtom);

  const form = useAppForm({
    defaultValues: {
      name: `Version ${project.current.project.versions.length + 1} - ${new Date().toLocaleDateString()}`,
      createFrom: "lastLayout",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Version name is required"),
        createFrom: z.enum(["empty", "lastLayout", "lastData"]),
      }),
    },
    onSubmit: (data) => {
      updateProject((prev) => {
        const newProject = createNewVersionProjectCommand(prev.project, {
          name: data.value.name,
          createFrom: data.value.createFrom as CreateNewVersionCommandCreateFrom,
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Version</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">Dialog for creating new version of the map</DialogDescription>
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
          <form.AppField name="createFrom">
            {(field) => (
              <field.RadioGroupField
                label="Create:"
                items={[
                  { label: "with last version layout", value: "lastLayout" },
                  { label: "with last version data and layout", value: "lastData" },
                  { label: "empty", value: "empty" },
                ]}
              />
            )}
          </form.AppField>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
