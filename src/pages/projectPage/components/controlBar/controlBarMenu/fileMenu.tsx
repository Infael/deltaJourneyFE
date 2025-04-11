import { DeleteModal } from "@/components/projectControlModals/deleteModal";
import { MoreInfoModal } from "@/components/projectControlModals/moreInfoModal";
import { NewProjectModal } from "@/components/projectControlModals/newProjectModal/newProjectModal";
import { RenameModal } from "@/components/projectControlModals/renameModal";
import { ShareModal } from "@/components/projectControlModals/shareModal";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useProjectSave } from "@/hooks/useProjectSave";
import { downloadDjFile } from "@/lib/downloadDjFile";
import { Routes } from "@/router/routes";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FileMenu = () => {
  const navigate = useNavigate();

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const {
    current: { project, projectMetadata, projectStorage },
  } = useAtomValue(projectAtom);

  const { savedProject, save } = useProjectSave();

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setNewProjectOpen(true)}>New Project</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={save} disabled={savedProject}>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={() => setMoreInfoModalOpen(true)}>More Info</MenubarItem>
          <MenubarItem onClick={() => setRenameDialogOpen(true)}>Rename</MenubarItem>
          <MenubarItem disabled={projectStorage === "local"} onClick={() => setShareDialogOpen(true)}>
            Share
          </MenubarItem>
          <MenubarItem
            disabled={projectStorage === "local"}
            onClick={() => setDeleteDialogOpen(true)}
            className="hover:bg-danger"
          >
            Delete
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>PNG</MenubarItem>
              <MenubarItem>PDF</MenubarItem>
              <MenubarItem onClick={() => downloadDjFile(project, projectMetadata.name)}>DeltaJourney</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <NewProjectModal
        open={newProjectOpen}
        setOpen={setNewProjectOpen}
        onCreate={(newProjectId: string) =>
          navigate(Routes.PROJECT_PAGE, { state: { fileMetadata: { id: newProjectId } } })
        }
      />
      <MoreInfoModal
        projectName={projectMetadata.name ?? "Project Name"}
        createdAt={projectMetadata.createdTime ?? "unknown"}
        lastModified={projectMetadata.modifiedTime ?? "unknown"}
        owners={
          projectMetadata.owners?.map((owner) => owner.displayName).filter((name): name is string => Boolean(name)) ?? [
            "Unknown",
          ]
        }
        open={moreInfoModalOpen}
        setOpen={setMoreInfoModalOpen}
      />
      <RenameModal
        projectName={projectMetadata.name}
        projectId={projectMetadata.id}
        open={renameDialogOpen}
        setOpen={setRenameDialogOpen}
      />
      <DeleteModal
        projectId={projectMetadata.id}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={() => navigate(Routes.ALL_PROJECTS_PAGE)}
      />
      {projectMetadata.id && projectStorage !== "local" && (
        <ShareModal projectId={projectMetadata.id} open={shareDialogOpen} setOpen={setShareDialogOpen} />
      )}
    </>
  );
};
