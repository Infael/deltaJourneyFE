import { useDriveFilesGet } from "@/api/driveApi/drive-api";
import { Spinner } from "@/components/ui/spinner/spinner";
import { Project } from "@/lib/project/models/project";
import { projectAtom } from "@/state/projectAtom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ControlBar } from "./components/controlBar/controlBar";
import { NewVersionAlertModal } from "./components/controlBar/controlBarVersionControl/newVersionAlertModal";
import { MapRenderer } from "./components/mapRenderer/mapRenderer";
import { VersionBar } from "./components/versionBar/versionBar";

export const ProjectPage = () => {
  const { state } = useLocation();
  const [projectData, setProjectData] = useAtom(projectAtom);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [noVersions, setNoVersions] = useState(false);

  const { mutateAsync: getDriveFile, isPending } = useDriveFilesGet();

  const getFile = (projectId: string) => {
    getDriveFile({ fileId: projectId, params: { alt: "media" } }).then((data) => {
      const project = data as Project;
      setProjectData((prev) => ({
        ...prev,
        current: {
          ...prev.current,
          project: project,
          actualShowedVersion: project.versions[0]?.id ?? "",
          projectStorage: "drive",
        },
      }));

      if (project.versions.length === 0) {
        setNoVersions(true);
      }
    });
  };

  const getFileMetadata = (projectId: string) => {
    getDriveFile({ fileId: projectId, params: { fields: "id, name, createdTime, modifiedTime, owners" } }).then(
      (data) => {
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
      },
    );
  };

  useEffect(() => {
    if (projectData.current.projectStorage !== "local" && state.fileMetadata.id) {
      getFile(state.fileMetadata.id);
      getFileMetadata(state.fileMetadata.id);
    }
  }, [getDriveFile, setProjectData]);

  useEffect(() => {
    if (noVersions) {
      setVersionModalOpen(true);
      setNoVersions(false);
    }
  }, [projectData, noVersions]);

  if (isPending) {
    return (
      <div className="flex w-screen items-center justify-center py-64">
        <Spinner text="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ControlBar />
      <VersionBar />
      <MapRenderer />
      <NewVersionAlertModal open={versionModalOpen} setOpen={setVersionModalOpen} />
    </div>
  );
};
