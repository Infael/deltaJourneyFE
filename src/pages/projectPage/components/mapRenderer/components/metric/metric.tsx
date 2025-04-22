import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteMetricCommand } from "@/lib/project/commands/metricCommands/deleteMetricCommand";
import { moveMetricCommand } from "@/lib/project/commands/metricCommands/moveMetricCommand";
import { Metric as MetricType, Touchpoint } from "@/lib/project/models/project";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC, useState } from "react";
import { MapCell } from "../mapCell";
import { RenameMetricModal } from "./renameMetricModal";

interface MetricProps {
  id: string;
  label: string;
  height: number;
  metrics: MetricType[];
  touchpoints: Touchpoint[];
}

export const Metric: FC<MetricProps> = ({ id, label, height, metrics, touchpoints }) => {
  const { presentationMode } = useAtomValue(viewAtom);
  const [, updateProject] = useAtom(projectWriteAtom);

  const [renameTouchpointModalOpen, setRenameTouchpointModalOpen] = useState(false);

  return (
    <>
      <MapCell resizeHorizontal id={id} height={height}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="absolute top-1 right-1">
              {!presentationMode && (
                <Button variant="ghost" className="h-6 px-2">
                  •••
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setRenameTouchpointModalOpen(true)}>Rename</DropdownMenuItem>
              <DropdownMenuItem
                disabled={metrics.findIndex((metric) => metric.id === id) === 0}
                onClick={() => {
                  updateProject((prev) => {
                    const newProject = moveMetricCommand(prev.project, {
                      metricId: id,
                      versionId: prev.actualShowedVersion,
                      down: false,
                    });
                    return {
                      ...prev,
                      project: newProject,
                    };
                  });
                }}
              >
                Move Up
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={metrics.findIndex((metric) => metric.id === id) === metrics.length - 1}
                onClick={() => {
                  updateProject((prev) => {
                    const newProject = moveMetricCommand(prev.project, {
                      metricId: id,
                      versionId: prev.actualShowedVersion,
                      down: true,
                    });
                    return {
                      ...prev,
                      project: newProject,
                    };
                  });
                }}
              >
                Move Down
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-danger"
                onClick={() => {
                  updateProject((prev) => {
                    const newProject = deleteMetricCommand(prev.project, {
                      metricId: id,
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
            <h4 className="text-lg font-bold">{label}</h4>
          </div>
          <RenameMetricModal
            open={renameTouchpointModalOpen}
            setOpen={setRenameTouchpointModalOpen}
            metricId={id}
            metricName={label}
          />
        </div>
      </MapCell>
      <MapCell gridSize={touchpoints.length}>ahoj</MapCell>
    </>
  );
};
