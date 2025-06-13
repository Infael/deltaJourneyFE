import { useUploadDriveFileUpdate } from "@/api/driveApi/custom-drive-api";
import { downloadDjFile } from "@/lib/downloadDjFile";
import { projectAtom } from "@/state/projectAtom";
import { saveAtom } from "@/state/saveAtom";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";

export const useProjectSave = () => {
  const [savedProject, setSavedProject] = useAtom(saveAtom);
  const {
    current: { projectStorage, project, projectMetadata },
  } = useAtomValue(projectAtom);

  const { mutateAsync: saveToDrive } = useUploadDriveFileUpdate();

  const save = () => {
    if (savedProject) {
      toast("The latest version is already saved.");
      return;
    }
    saveWithoutCheck();
  };

  /**
   * Save project without checking if it is already saved.
   * "save" should be used instead
   */
  const saveWithoutCheck = () => {
    if (projectStorage === "local") {
      downloadDjFile(project, projectMetadata.name);
      setSavedProject(true);
    }
    if (projectStorage === "drive") {
      const formData = new FormData();
      formData.append("metadata", new Blob([JSON.stringify({})], { type: "application/json" }));
      formData.append("file", new Blob([JSON.stringify(project)], { type: "application/json" }));

      toast.promise(
        saveToDrive(
          { fileId: projectMetadata.id, data: formData, params: { uploadType: "multipart" } },
          {
            onSuccess: () => {
              setSavedProject(true);
            },
          },
        ),
        {
          loading: "Saving project...",
          success: "Project saved successfully",
          error: "Error saving project",
        },
      );
    }
  };

  // handle keyboard shortcuts for saving
  useEffect(() => {
    const handleSaveShortcut = (event: KeyboardEvent) => {
      // mac is metaKey; windows is ctrlKey
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handleSaveShortcut);
    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [project, projectMetadata, projectStorage, saveToDrive, save]);

  // handle page quit with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!savedProject) {
        e.preventDefault();
        e.returnValue = "";
      }
      return undefined;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [savedProject]);

  return {
    savedProject,
    save,
    saveWithoutCheck,
  };
};
