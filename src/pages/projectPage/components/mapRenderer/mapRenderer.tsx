import { Spinner } from "@/components/ui/spinner/spinner";
import { ProjectVersion } from "@/lib/project/models/project";
import { projectAtom } from "@/state/projectAtom";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { viewAtom } from "@/state/viewAtom";
import { MapCell } from "./components/mapCell";
import { Metric } from "./components/metric/metric";
import { NewMetricButton } from "./components/metric/newMetricButton";
import { NewTouchpointButton } from "./components/touchpoint/newTouchpointButton";
import { Touchpoint } from "./components/touchpoint/touchpoint";

export const MapRenderer = () => {
  const [
    {
      current: { project, actualShowedVersion },
    },
  ] = useAtom(projectAtom);
  const { showedHud } = useAtomValue(viewAtom);

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
          <div className="grid" style={{ gridTemplateColumns: `repeat(${versionData.touchpoints.length}, auto) 1fr` }}>
            <MapCell>
              <h3 className="text-lg font-bold">Touchpoints</h3>
            </MapCell>
            {versionData.touchpoints.map((touchpoint) => (
              <Touchpoint
                key={touchpoint.id}
                id={touchpoint.id}
                name={touchpoint.name}
                width={touchpoint.width}
                touchpoints={versionData.touchpoints}
              />
            ))}
            {versionData.metrics.map((metric) => (
              <Metric
                key={metric.id}
                metricInfo={metric}
                metrics={versionData.metrics}
                touchpoints={versionData.touchpoints}
              />
            ))}
            <NewMetricButton gridSize={versionData.touchpoints.length + 1} />
          </div>
          <NewTouchpointButton />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
