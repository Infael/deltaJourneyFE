import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { useState } from "react";
import { DeleteVersionModal } from "../controlBarVersionControl/deleteVersionModal";
import { NewVersionModal } from "../controlBarVersionControl/newVersionModal";
import { RenameVersionModal } from "../controlBarVersionControl/renameVersionModal";
import { VersionInfoModal } from "../controlBarVersionControl/versionInfoModal";

export const VersionMenu = () => {
  const [newVersionOpen, setNewVersionOpen] = useState(false);
  const [versionInfoModalOpen, setVersionInfoModalOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Version</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setNewVersionOpen(true)}>New Version</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => setVersionInfoModalOpen(true)}>Version Info</MenubarItem>
          <MenubarItem onClick={() => setRenameDialogOpen(true)}>Rename Current Version</MenubarItem>
          <MenubarItem onClick={() => setDeleteDialogOpen(true)} className="hover:bg-danger">
            Delete Current Version
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <NewVersionModal open={newVersionOpen} setOpen={setNewVersionOpen} />
      <VersionInfoModal open={versionInfoModalOpen} setOpen={setVersionInfoModalOpen} />
      <RenameVersionModal open={renameDialogOpen} setOpen={setRenameDialogOpen} />
      <DeleteVersionModal open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
    </>
  );
};
