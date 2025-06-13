import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
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
import { currentProjectVersionAtom } from "@/state/projectWriteAtom";
import { useAtomValue } from "jotai";
import { NotebookPenIcon } from "lucide-react";
import { FC, useMemo } from "react";
import { TouchpointFormGains } from "./touchpointFormGains";
import { TouchpointFormPains } from "./touchpointFormPains";
import { TouchpointNotes } from "./touchpointNotes";

interface TouchpointNotesProps {
  id: string;
}

export const TouchpointMenu: FC<TouchpointNotesProps> = ({ id }) => {
  const currentVersion = useAtomValue(currentProjectVersionAtom);

  const touchpoint = useMemo(() => currentVersion?.touchpoints.find((tp) => tp.id === id), [currentVersion, id]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-6 px-2">
          <NotebookPenIcon />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" portalContainerId="">
        <SheetHeader>
          <SheetTitle>{touchpoint?.name}</SheetTitle>
          <SheetDescription>
            Here you can add and edit notes for the touchpoint or see pains and gains from your survey responses.
          </SheetDescription>
        </SheetHeader>
        <div className="mx-4 flex flex-col gap-4">
          <TouchpointNotes touchpointId={id} />
          <Heading level="h3" className="pt-8">
            Survey results
          </Heading>
          <TouchpointFormGains touchpointId={id} />
          <TouchpointFormPains touchpointId={id} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
