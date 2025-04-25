import { DeleteModal } from "@/components/projectControlModals/deleteModal";
import { MoreInfoModal } from "@/components/projectControlModals/moreInfoModal";
import { NewProjectModal } from "@/components/projectControlModals/newProjectModal/newProjectModal";
import { RenameModal } from "@/components/projectControlModals/renameModal";
import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { Routes } from "@/router/routes";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const VersionMenu = () => {
  const navigate = useNavigate();

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    current: { projectMetadata, projectStorage },
  } = useAtomValue(projectAtom);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Version</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setNewProjectOpen(true)}>New Version</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => setMoreInfoModalOpen(true)}>Version Info</MenubarItem>
          <MenubarItem onClick={() => setRenameDialogOpen(true)}>Rename Current Version</MenubarItem>
          <MenubarItem
            disabled={projectStorage === "local"}
            onClick={() => setDeleteDialogOpen(true)}
            className="hover:bg-danger"
          >
            Delete Current Version
          </MenubarItem>
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
    </>
  );
};
