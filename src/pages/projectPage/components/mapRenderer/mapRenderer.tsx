import { Spinner } from "@/components/ui/spinner/spinner";
import { ProjectVersion } from "@/lib/project/models/project";
import { projectAtom } from "@/state/projectAtom";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { viewAtom } from "@/state/viewAtom";
import { MapCell } from "./components/mapCell";
import { NewMetricButton } from "./components/newMetricButton";
import { NewTouchpointButton } from "./components/newTouchpointButton";
import { Touchpoint } from "./components/touchpoint";

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
              <MapCell key={touchpoint.id} resizeVertical id={touchpoint.id} width={touchpoint.width}>
                <Touchpoint id={touchpoint.id} name={touchpoint.name} touchpoints={versionData.touchpoints} />
              </MapCell>
            ))}
            {versionData.metrics.map((metric) => (
              <MapCell
                key={metric.id}
                resizeHorizontal
                gridSize={versionData.touchpoints.length + 1}
                id={metric.id}
                height={metric.height}
              >
                {metric.label}
              </MapCell>
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
