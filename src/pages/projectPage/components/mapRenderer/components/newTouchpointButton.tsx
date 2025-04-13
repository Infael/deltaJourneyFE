import { Paragraph } from "@/components/ui/paragraph";
import { addTouchpointProjectCommand } from "@/lib/project/commands/addTouchpointProjectCommand";
import { useAtomValue, useSetAtom } from "jotai";
import { MapCell } from "./mapCell";

import { projectWriteAtom } from "@/state/projectWriteAtom";
import { ViewAtom } from "@/state/viewAtom";
import plusIcon from "../assets/plusIcon.svg";

export const NewTouchpointButton = () => {
  const { presentationMode } = useAtomValue(ViewAtom);
  const updateProject = useSetAtom(projectWriteAtom);

  if (presentationMode) {
    return null;
  }

  return (
    <MapCell className="hover:bg-main w-42 hover:cursor-pointer">
      <button
        className="flex h-full w-full flex-col items-center gap-4 p-4"
        onClick={() => {
          updateProject((prev) => {
            const newProject = addTouchpointProjectCommand(prev.project, {
              name: "New Touchpoint",
              versionId: prev.actualShowedVersion,
            });

            return {
              ...prev,
              project: newProject,
            };
          });
        }}
      >
        <img src={plusIcon} alt="add new touchpoint" />
        <Paragraph>New Touchpoint</Paragraph>
      </button>
    </MapCell>
  );
};
