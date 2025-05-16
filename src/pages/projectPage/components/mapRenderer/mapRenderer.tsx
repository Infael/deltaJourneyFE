import { Spinner } from "@/components/ui/spinner/spinner";
import { useAtomValue } from "jotai";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { mapStyleAtom } from "@/state/mapStyleAtom";
import { currentProjectVersionAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { MapCell } from "./components/mapCell";
import { Metric } from "./components/metric/metric";
import { NewMetricButton } from "./components/metric/newMetricButton";
import { NewTouchpointButton } from "./components/touchpoint/newTouchpointButton";
import { Touchpoint } from "./components/touchpoint/touchpoint";

export const MapRenderer = () => {
  const { showedHud } = useAtomValue(viewAtom);
  const mapStyle = useAtomValue(mapStyleAtom);

  const versionData = useAtomValue(currentProjectVersionAtom);

  if (!versionData) {
    return (
      <div className="flex w-screen items-center justify-center py-64">
        <Spinner text="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-2 pl-8">
      <ScrollArea className={showedHud ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-120px)]"}>
        <div
          className="bg-bw flex max-w-max rounded-md border-2"
          style={{ background: mapStyle.bgColor, color: mapStyle.textColor }}
        >
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
