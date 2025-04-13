import { Paragraph } from "@/components/ui/paragraph";
import { useAtomValue, useSetAtom } from "jotai";
import { MapCell } from "./mapCell";

import { addMetricCommand } from "@/lib/project/commands/metricCommands/addMetricCommand";
import { MetricType } from "@/lib/project/models/metrics";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { FC } from "react";
import plusIcon from "../assets/plusIcon.svg";

interface NewMetricButtonProps {
  gridSize: number;
}

export const NewMetricButton: FC<NewMetricButtonProps> = ({ gridSize }) => {
  const { presentationMode } = useAtomValue(viewAtom);
  const updateProject = useSetAtom(projectWriteAtom);

  if (presentationMode) {
    return null;
  }

  return (
    <MapCell className="hover:bg-main hover:cursor-pointer" gridSize={gridSize}>
      <button
        className="flex w-full flex-col items-center gap-4 p-4"
        onClick={() => {
          updateProject((prev) => {
            const newProject = addMetricCommand(prev.project, {
              name: "New Metric",
              versionId: prev.actualShowedVersion,
              metricKey: MetricType.TEXT,
            });

            return {
              ...prev,
              project: newProject,
            };
          });
        }}
      >
        <img src={plusIcon} alt="add new Metric" className="h-32" />
        <Paragraph>New Metric</Paragraph>
      </button>
    </MapCell>
  );
};
