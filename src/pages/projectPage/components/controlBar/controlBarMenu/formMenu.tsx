import { DeleteFormModal } from "@/components/formModals/deleteFormModal";
import { NewFormModal } from "@/components/formModals/newFormModal";
import { MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { toast } from "sonner";

export const FormMenu = () => {
  const [newFormOpen, setNewFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { current: project } = useAtomValue(projectAtom);

  const copyFormUrlToClipboard = () => {
    if (project.project.formData) {
      navigator.clipboard
        .writeText(project.project.formData.responderUri)
        .then(() => {
          toast.success("Form URL copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy form URL to clipboard.");
        });
    }
  };

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Form</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => setNewFormOpen(true)} disabled={project.project.formData !== undefined}>
            Create Form {project.project.formData !== undefined ? "(already exists)" : ""}
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled={!project.project.formData} onClick={copyFormUrlToClipboard}>
            Get URL for respondents
          </MenubarItem>
          <MenubarItem
            className="hover:bg-danger"
            disabled={!project.project.formData}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <NewFormModal open={newFormOpen} setOpen={setNewFormOpen} />
      <DeleteFormModal open={deleteOpen} setOpen={setDeleteOpen} />
    </>
  );
};
