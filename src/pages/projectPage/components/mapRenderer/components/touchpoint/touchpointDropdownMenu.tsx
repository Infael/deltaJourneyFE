import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTouchpointCommand } from "@/lib/project/commands/touchpointCommands/deleteTouchpointCommand";
import { moveTouchpointCommand } from "@/lib/project/commands/touchpointCommands/moveTouchpointCommand";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom } from "jotai";
import { FC, useState } from "react";
import { RenameTouchpointModal } from "./renameTouchpointModal";

interface TouchpointDropdownMenuProps {
  id: string;
  name: string;
  touchpoints: { id: string; name: string }[];
}

export const TouchpointDropdownMenu: FC<TouchpointDropdownMenuProps> = ({ id, name, touchpoints }) => {
  const [, updateProject] = useAtom(projectWriteAtom);
  const [renameTouchpointModalOpen, setRenameTouchpointModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-6 px-2">
            •••
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setRenameTouchpointModalOpen(true)}>Rename</DropdownMenuItem>
          <DropdownMenuItem
            disabled={touchpoints.findIndex((touchpoint) => touchpoint.id === id) === 0}
            onClick={() => {
              updateProject((prev) => {
                const newProject = moveTouchpointCommand(prev.project, {
                  touchpointId: id,
                  versionId: prev.actualShowedVersion,
                  right: false,
                });
                return {
                  ...prev,
                  project: newProject,
                };
              });
            }}
          >
            Move Left
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={touchpoints.findIndex((touchpoint) => touchpoint.id === id) === touchpoints.length - 1}
            onClick={() => {
              updateProject((prev) => {
                const newProject = moveTouchpointCommand(prev.project, {
                  touchpointId: id,
                  versionId: prev.actualShowedVersion,
                  right: true,
                });
                return {
                  ...prev,
                  project: newProject,
                };
              });
            }}
          >
            Move Right
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-danger"
            onClick={() => {
              updateProject((prev) => {
                const newProject = deleteTouchpointCommand(prev.project, {
                  touchpointId: id,
                  versionId: prev.actualShowedVersion,
                });
                return {
                  ...prev,
                  project: newProject,
                };
              });
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameTouchpointModal
        open={renameTouchpointModalOpen}
        setOpen={setRenameTouchpointModalOpen}
        touchpointId={id}
        touchpointName={name}
      />
    </>
  );
};
