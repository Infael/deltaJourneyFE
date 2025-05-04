import { viewAtom } from "@/state/viewAtom";

import { TextMetricData } from "@/lib/project/models/metrics";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { MapCell } from "../../../mapCell";
import { MetricDataWithTouchpoint } from "../../metric";
import { TextMetricEditor } from "./textMetricEditor";

interface TextMetricProps {
  metricData: MetricDataWithTouchpoint<TextMetricData>[];
}

export const TextMetric: FC<TextMetricProps> = ({ metricData: data }) => {
  const { presentationMode } = useAtomValue(viewAtom);

  return data.map((metric, index) => (
    <MapCell key={`${metric.metricData?.id}_${index}`} className="overflow-visible">
      {presentationMode && metric.metricData && (
        <p className="text-center text-sm" dangerouslySetInnerHTML={{ __html: metric.metricData.value }}></p>
      )}
      <div className={presentationMode ? "hidden" : ""}>
        <TextMetricEditor data={metric} />
      </div>
    </MapCell>
  ));
};
