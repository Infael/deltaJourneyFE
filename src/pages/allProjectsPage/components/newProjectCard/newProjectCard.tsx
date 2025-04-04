import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";

import { useState } from "react";
import plusIcon from "./assets/plusIcon.svg";
import { NewProjectForm } from "./newProjectForm";

export const NewProjectCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="hover:translate-x-boxShadowX hover:translate-y-boxShadowY w-64 cursor-default hover:shadow-none">
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-8">
            <img src={plusIcon} alt="create new project" className="size-36" />
            <Heading level="h3">Create new Project</Heading>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Project</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden">Dialog for creating new project</DialogDescription>
        <NewProjectForm onCreate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
