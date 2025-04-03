import { useDriveFilesListSuspense } from "@/api/driveApi/drive-api";
import { Heading } from "@/components/ui/heading";
import { NewProjectCard } from "./components/newProjectCard/newProjectCard";
import { OpenLocallyCard } from "./components/openLocallyCard/openLocallyCard";
import { ProjectCard } from "./components/projectCard/projectCard";

export const AllProjectsPage = () => {
  const { data } = useDriveFilesListSuspense({
    orderBy: "modifiedTime,createdTime,name",
  });

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
            title={file.name?.split(".")[0] ?? `Drive File ${file.id}`}
            onClick={() => {}}
            storage="drive"
          />
        ))}
      </div>
    </div>
  );
};
