import { useDriveFilesListSuspense } from "@/api/driveApi/drive-api";
import { Heading } from "@/components/ui/heading";
import { Routes } from "@/router/routes";
import { initialProjectState, projectAtom } from "@/state/projectAtom";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NewProjectCard } from "./components/newProjectCard/newProjectCard";
import { OpenLocallyCard } from "./components/openLocallyCard/openLocallyCard";
import { ProjectCard } from "./components/projectCard/projectCard";

export const AllProjectsPage = () => {
  const navigate = useNavigate();
  const setProjectData = useSetAtom(projectAtom);

  const { data } = useDriveFilesListSuspense({
    orderBy: "createdTime desc,name",
    fields: "files(id,name,mimeType,createdTime,modifiedTime,owners)",
  });

  useEffect(() => {
    setProjectData(initialProjectState);
  }, [setProjectData]);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 p-8">
      <Heading level="h2">Your Client Journey Maps:</Heading>
      <div className="mt-4 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <NewProjectCard />
        <OpenLocallyCard />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {data.files?.map((file) => (
          <ProjectCard
            key={file.id}
            id={file.id!}
            projectName={file.name?.split(".")[0] ?? `Drive File ${file.id}`}
            createdAt={file.createdTime!}
            lastModified={file.modifiedTime!}
            owners={
              file.owners?.map((owner) => owner.displayName).filter((name): name is string => Boolean(name)) ?? [
                "Unknown",
              ]
            }
            onOpen={() => navigate(Routes.PROJECT_PAGE, { state: { fileMetadata: file } })}
            storage="drive"
          />
        ))}
      </div>
    </div>
  );
};
