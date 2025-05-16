import { useAnalyticsdataPropertiesRunReport } from "@/api/gaDataApi/gaDataApi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { updateNumericMetricValueCommand } from "@/lib/project/commands/metricCommands/numericMetricCommands/updateNumericMetricCommand";
import { NumericMetricData } from "@/lib/project/models/metrics";
import { currentProjectVersionAtom, projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtom, useAtomValue } from "jotai";
import { RefreshCcwIcon } from "lucide-react";
import { FC } from "react";
import { toast } from "sonner";
import { MetricDataWithTouchpoint } from "../../metric";

interface NumericMetricFieldReloadProps {
  metricData: MetricDataWithTouchpoint<NumericMetricData>;
}

export const NumericMetricFieldReload: FC<NumericMetricFieldReloadProps> = ({ metricData }) => {
  const projectVersion = useAtomValue(currentProjectVersionAtom);
  const [, updateProject] = useAtom(projectWriteAtom);
  const { presentationMode, editable } = useAtomValue(viewAtom);

  const { mutateAsync: runReport } = useAnalyticsdataPropertiesRunReport();

  if (!metricData.metricData) return null;

  const handleReload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!metricData.metricData) return;

    if (metricData.metricData.numericTypeKey === "ga") {
      console.log(projectVersion?.startDate);

      toast.promise(
        runReport(
          {
            property: metricData.metricData.gaProperties.property,
            data: {
              dateRanges: [
                {
                  startDate: (
                    projectVersion?.startDate ?? new Date(new Date().setDate(new Date().getMonth() - 1)).toISOString()
                  ).split("T")[0],
                  endDate: (projectVersion?.endDate ?? new Date().toISOString()).split("T")[0],
                },
              ],
              metrics: [
                {
                  name: `${metricData.metricData.gaProperties.metric}_DeltaJourney`,
                  expression: metricData.metricData.gaProperties.metric,
                },
              ],
            },
          },
          {
            onSuccess: (result) => {
              updateProject((project) => {
                const newProject = updateNumericMetricValueCommand(project.project, {
                  metricId: metricData.metricId,
                  touchpointId: metricData.touchpointId,
                  versionId: project.actualShowedVersion,
                  value: {
                    ...metricData.metricData,
                    value: parseFloat(result?.rows?.[0]?.metricValues?.[0]?.value ?? "0"),
                  },
                });
                return {
                  ...project,
                  project: newProject,
                };
              });
            },
          },
        ),
        {
          loading: "Fetching data...",
          success: "New data fetched successfully",
          error: "Error while fetching data",
        },
      );
    }
  };

  if (presentationMode || !editable) return null;

  return (
    <div className="absolute top-2 right-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <RefreshCcwIcon size={16} onClick={handleReload} />
          </TooltipTrigger>
          <TooltipContent side="left">Reload data -{">"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
