import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppForm } from "@/hooks/useForm";
import { currentProjectVersionAtom } from "@/state/projectWriteAtom";
import { useAtomValue } from "jotai";
import { PencilIcon } from "lucide-react";
import { FC, useMemo } from "react";
import { z } from "zod";

interface TouchpointNotesProps {
  id: string;
}

export const TouchpointNotes: FC<TouchpointNotesProps> = ({ id }) => {
  const currentVersion = useAtomValue(currentProjectVersionAtom);

  const touchpoint = useMemo(() => currentVersion?.touchpoints.find((tp) => tp.id === id), [currentVersion, id]);

  const form = useAppForm({
    defaultValues: {
      notes: "",
    },
    validators: {
      onChange: z.object({
        notes: z.string(),
      }),
    },
  });

  if (!touchpoint) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-6 px-2">
          <PencilIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" portalContainerId="">
        <SheetHeader>
          <SheetTitle>{touchpoint?.name}</SheetTitle>
          <SheetDescription>Here you can add and edit notes for the touchpoint.</SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex-1 px-4"
        >
          <form.AppField name="notes">{(field) => <field.AreaField />}</form.AppField>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save and close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
