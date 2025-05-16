import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteTouchpointCommand } from "@/lib/project/commands/touchpointCommands/deleteTouchpointCommand";
import { moveTouchpointCommand } from "@/lib/project/commands/touchpointCommands/moveTouchpointCommand";
import { Touchpoint as TouchpointType } from "@/lib/project/models/project";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";

import { useAtom, useAtomValue } from "jotai";
import { FC, useState } from "react";
import { MapCell } from "../mapCell";
import { RenameTouchpointModal } from "./renameTouchpointModal";

interface TouchpointProps {
  id: string;
  name: string;
  width: number;
  touchpoints: TouchpointType[];
}

export const Touchpoint: FC<TouchpointProps> = ({ id, name, width, touchpoints }) => {
  const { presentationMode, editable } = useAtomValue(viewAtom);
  const [, updateProject] = useAtom(projectWriteAtom);

  const [renameTouchpointModalOpen, setRenameTouchpointModalOpen] = useState(false);

  return (
    <MapCell resizeVertical id={id} width={width} className="min-w-full">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="absolute top-1 right-1">
            {!presentationMode && editable && (
              <Button variant="ghost" className="h-6 px-2">
                •••
              </Button>
            )}
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
        <div>
          <h4 className="text-lg font-bold">{name}</h4>
        </div>
        <RenameTouchpointModal
          open={renameTouchpointModalOpen}
          setOpen={setRenameTouchpointModalOpen}
          touchpointId={id}
          touchpointName={name}
        />
      </div>
    </MapCell>
  );
};
