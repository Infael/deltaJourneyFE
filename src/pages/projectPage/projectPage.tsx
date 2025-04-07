import { useDriveFilesGet } from "@/api/driveApi/drive-api";
import { Spinner } from "@/components/ui/spinner/spinner";
import { projectAtom } from "@/state/projectAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ControlBar } from "./components/controlBar/controlBar";

export const ProjectPage = () => {
  const { state } = useLocation();
  const [projectData, setProjectData] = useAtom(projectAtom);

  const { mutateAsync: getDriveFile, isPending } = useDriveFilesGet();

  const getFile = (projectId: string) => {
    getDriveFile({ fileId: projectId, params: { alt: "media" } })
      .then((data) => {
        setProjectData((prev) => ({
          ...prev,
          project: data,
          projectStorage: "drive",
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
          projectMetadata: {
            name: data.name!.split(".")[0],
            id: data.id!,
            createdTime: data.createdTime!,
            modifiedTime: data.modifiedTime!,
            owners: data.owners!,
          },
          projectStorage: "drive",
        }));
      })
      .catch((error) => {
        console.error("Error fetching file metadata:", error);
      });
  };

  useEffect(() => {
    if (projectData.projectStorage !== "local" && state.fileMetadata.id) {
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
    <div>
      <ControlBar />
    </div>
  );
};
