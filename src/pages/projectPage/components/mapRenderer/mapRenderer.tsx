import { Spinner } from "@/components/ui/spinner/spinner";
import { ProjectVersion } from "@/lib/project/models/project";
import { projectAtom } from "@/state/projectAtom";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { Paragraph } from "@/components/ui/paragraph";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AddMetricProjectCommand } from "@/lib/project/commands/addMetricProjectCommand";
import { AddTouchpointProjectCommand } from "@/lib/project/commands/addTouchpointProjectCommand";
import { MetricType } from "@/lib/project/models/metrics";
import { ViewAtom } from "@/state/viewAtom";
import plusIcon from "./assets/plusIcon.svg";

export const MapRenderer = () => {
  const [{ project, actualShowedVersion }, setProject] = useAtom(projectAtom);
  const { showedHud } = useAtomValue(ViewAtom);

  const versionData = useMemo<ProjectVersion | undefined>(() => {
    return project.versions.find((v) => v.id === actualShowedVersion);
  }, [project, actualShowedVersion]);

  if (!versionData) {
    return (
      <div className="flex w-screen items-center justify-center py-64">
        <Spinner text="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex py-4 pl-8">
      <ScrollArea className={showedHud ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-120px)]"}>
        <div className="bg-bw flex max-w-max rounded-md border-2">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${versionData.touchpoints.length + 1}, 1fr)` }}>
            <div className="p-4 outline">
              <h3 className="text-lg font-bold">Touchpoints</h3>
            </div>
            {versionData.touchpoints.map((touchpoint) => (
              <div key={touchpoint.id} className="flex flex-col items-center gap-4 p-4 outline">
                <h3 className="text-lg font-bold">{touchpoint.name}</h3>
              </div>
            ))}
            {versionData.metrics.map((metric) => (
              <div
                key={metric.label}
                className="h-23 outline"
                style={{ gridColumn: `span ${versionData.touchpoints.length + 1}` }}
              >
                {metric.label}
              </div>
            ))}
            <div
              className="hover:bg-main flex h-50 flex-col items-center gap-4 p-4 outline hover:cursor-pointer"
              style={{ gridColumn: `span ${versionData.touchpoints.length + 1}` }}
              onClick={() => {
                setProject((prev) => {
                  const newProject = new AddMetricProjectCommand().execute(prev.project, {
                    name: "New Metric",
                    versionId: actualShowedVersion,
                    metricKey: MetricType.TEXT,
                  });
                  return { ...prev, project: newProject };
                });
              }}
            >
              <img src={plusIcon} alt="add new Metric" className="h-32" />
              <Paragraph>New Metric</Paragraph>
            </div>
          </div>

          <div
            className="hover:bg-main flex w-42 flex-col items-center gap-4 p-4 outline hover:cursor-pointer"
            onClick={() => {
              setProject((prev) => {
                const newProject = new AddTouchpointProjectCommand().execute(prev.project, {
                  name: "New touchpoint",
                  versionId: actualShowedVersion,
                });
                return { ...prev, project: newProject };
              });
            }}
          >
            <img src={plusIcon} alt="add new touchpoint" />
            <Paragraph>New Touchpoint</Paragraph>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
