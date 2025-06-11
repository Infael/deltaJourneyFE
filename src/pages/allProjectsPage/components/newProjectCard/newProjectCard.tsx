import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

import { NewProjectModal } from "@/components/projectControlModals/newProjectModal/newProjectModal";
import { Routes } from "@/router/routes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import plusIcon from "./assets/plusIcon.svg";

export const NewProjectCard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="hover:translate-x-boxShadowX hover:translate-y-boxShadowY w-64 cursor-default hover:shadow-none"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-8">
          <img src={plusIcon} alt="create new project" className="size-36" />
          <Heading level="h3">Create new</Heading>
        </div>
      </Card>
      <NewProjectModal
        open={open}
        setOpen={setOpen}
        onCreate={(projectId: string) => navigate(Routes.PROJECT_PAGE, { state: { fileMetadata: { id: projectId } } })}
      />
    </>
  );
};
