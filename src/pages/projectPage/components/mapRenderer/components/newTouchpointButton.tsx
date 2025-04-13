import { Paragraph } from "@/components/ui/paragraph";
import { useAtomValue, useSetAtom } from "jotai";
import { MapCell } from "./mapCell";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { addTouchpointCommand } from "@/lib/project/commands/touchpointCommands/addTouchpointCommand";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { z } from "zod";
import plusIcon from "../assets/plusIcon.svg";

export const NewTouchpointButton = () => {
  const { presentationMode } = useAtomValue(viewAtom);
  const updateProject = useSetAtom(projectWriteAtom);

  const form = useAppForm({
    defaultValues: {
      name: "New Touchpoint",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Touchpoint name is required"),
      }),
    },
    onSubmit: (data) => {
      updateProject((prev) => {
        const newProject = addTouchpointCommand(prev.project, {
          name: data.value.name,
          versionId: prev.actualShowedVersion,
        });

        return {
          ...prev,
          project: newProject,
        };
      });
    },
  });

  if (presentationMode) {
    return null;
  }

  return (
    <MapCell className="hover:bg-main w-42 hover:cursor-pointer">
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex h-full w-full flex-col items-center gap-4 p-4">
            <img src={plusIcon} alt="add new touchpoint" />
            <Paragraph>New Touchpoint</Paragraph>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new Touchpoint</DialogTitle>
            <DialogDescription className="hidden">Dialog for creating new touchpoint</DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.AppField name="name">
              {(field) => (
                <field.TextField label="Enter the name for your new Touchpoint:" placeholder="Touchpoint name" />
              )}
            </form.AppField>
            <DialogClose asChild>
              <Button type="submit">Create</Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </MapCell>
  );
};
