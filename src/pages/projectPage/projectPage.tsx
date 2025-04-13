import { useDriveFilesGet } from "@/api/driveApi/drive-api";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Project } from "@/lib/project/models/project";
import { cn } from "@/lib/utils";
import { projectAtom } from "@/state/projectAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ControlBar } from "./components/controlBar/controlBar";
import { MapRenderer } from "./components/mapRenderer/mapRenderer";

export const ProjectPage = () => {
  const { state } = useLocation();
  const [projectData, setProjectData] = useAtom(projectAtom);
  const { presentationMode } = useAtomValue(viewAtom);

  const { mutateAsync: getDriveFile, isPending } = useDriveFilesGet();

  const getFile = (projectId: string) => {
    getDriveFile({ fileId: projectId, params: { alt: "media" } })
      .then((data) => {
        const project = data as Project;
        setProjectData((prev) => ({
          ...prev,
          current: {
            ...prev.current,
            project: project,
            actualShowedVersion: project.versions.toSorted(
              (a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
            )[0].id,
            projectStorage: "drive",
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });
  };
  const getFileMetadata = (projectId: string) => {
    getDriveFile({ fileId: projectId, params: { fields: "id, name, createdTime, modifiedTime, owners" } })
      .then((data) => {
        setProjectData((prev) => ({
          ...prev,
          current: {
            ...prev.current,
            projectMetadata: {
              id: data.id!,
              name: data.name!,
              createdTime: data.createdTime!,
              modifiedTime: data.modifiedTime!,
              owners: data.owners!,
            },
            projectStorage: "drive",
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching file metadata:", error);
      });
  };

  useEffect(() => {
    if (projectData.current.projectStorage !== "local" && state.fileMetadata.id) {
      getFile(state.fileMetadata.id);
      getFileMetadata(state.fileMetadata.id);
    }
  }, [getDriveFile, setProjectData]);

  if (isPending) {
    return (
      <div className="flex w-screen items-center justify-center py-64">
        <Spinner text="Loading..." />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", presentationMode && "items-center justify-center")}>
      <ControlBar />
      <MapRenderer />
    </div>
  );
};
