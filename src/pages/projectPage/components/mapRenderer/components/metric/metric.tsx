import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteMetricCommand } from "@/lib/project/commands/metricCommands/deleteMetricCommand";
import { moveMetricCommand } from "@/lib/project/commands/metricCommands/moveMetricCommand";
import { ExperienceMetricData, MetricData, MetricType, TextMetricData } from "@/lib/project/models/metrics";
import { MetricInfo, Touchpoint } from "@/lib/project/models/project";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC, useMemo, useState } from "react";
import { MapCell } from "../mapCell";
import { ExperienceMetric } from "./metricTypes/experienceMetric";
import { TextMetric } from "./metricTypes/textMetric";
import { RenameMetricModal } from "./renameMetricModal";

interface MetricProps {
  metricInfo: MetricInfo;
  touchpoints: Touchpoint[];
  metrics: MetricInfo[];
}

export type MetricDataWithTouchpoint<T extends MetricData> = {
  touchpointId: string;
  touchpointWidth: number;
  metricId: string;
} & ({ metricData: T } | { metricData: undefined });

export const Metric: FC<MetricProps> = ({ metricInfo, touchpoints, metrics }) => {
  const { presentationMode } = useAtomValue(viewAtom);
  const [, updateProject] = useAtom(projectWriteAtom);

  const [renameTouchpointModalOpen, setRenameTouchpointModalOpen] = useState(false);

  const metricData = useMemo(() => {
    return touchpoints.map((touchpoint) => ({
      touchpointId: touchpoint.id,
      touchpointWidth: touchpoint.width,
      metricId: metricInfo.id,
      metricData: touchpoint.metricsData.find((metric) => metric.id === metricInfo.id),
    }));
  }, [metricInfo, touchpoints]);

  const getMetricContentComponent = () => {
    switch (metricInfo.key) {
      case MetricType.TEXT:
        return <TextMetric metricData={metricData as MetricDataWithTouchpoint<TextMetricData>[]} />;
      case MetricType.EXPERIENCE:
        return (
          <ExperienceMetric
            metricData={metricData as MetricDataWithTouchpoint<ExperienceMetricData>[]}
            height={metricInfo.height}
          />
        );
      default:
        return <MapCell gridSize={touchpoints.length}>Metric Type Not Implemented Yet</MapCell>;
    }
  };

  return (
    <>
      <MapCell resizeHorizontal id={metricInfo.id} height={metricInfo.height}>
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
                disabled={metrics.findIndex((metric) => metric.id === metricInfo.id) === 0}
                onClick={() => {
                  updateProject((prev) => {
                    const newProject = moveMetricCommand(prev.project, {
                      metricId: metricInfo.id,
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
                disabled={metrics.findIndex((metric) => metric.id === metricInfo.id) === metrics.length - 1}
                onClick={() => {
                  updateProject((prev) => {
                    const newProject = moveMetricCommand(prev.project, {
                      metricId: metricInfo.id,
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
                      metricId: metricInfo.id,
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
            <h4 className="text-lg font-bold">{metricInfo.label}</h4>
          </div>
          <RenameMetricModal
            open={renameTouchpointModalOpen}
            setOpen={setRenameTouchpointModalOpen}
            metricId={metricInfo.id}
            metricName={metricInfo.label}
          />
        </div>
      </MapCell>
      {getMetricContentComponent()}
    </>
  );
};
