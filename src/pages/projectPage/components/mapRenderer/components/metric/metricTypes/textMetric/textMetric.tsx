import { viewAtom } from "@/state/viewAtom";

import { TextMetricData } from "@/lib/project/models/metrics";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { MapCell } from "../../../mapCell";
import { MetricDataWithTouchpoint } from "../../metric";
import { TextMetricContent } from "./textMetricContent";
import { TextMetricEditor } from "./textMetricEditor";

interface TextMetricProps {
  metricData: MetricDataWithTouchpoint<TextMetricData>[];
}

export const TextMetric: FC<TextMetricProps> = ({ metricData: data }) => {
  const { presentationMode, editable } = useAtomValue(viewAtom);

  return data.map((metric, index) => (
    <MapCell key={`${metric.metricData?.id}_${index}`} className="overflow-visible">
      {(presentationMode || !editable) && metric.metricData && (
        <TextMetricContent content={metric.metricData.value} comparedContent={metric.comparedMetricData?.value} />
      )}
      <div className={presentationMode || !editable ? "hidden" : ""}>
        <TextMetricEditor data={metric} />
      </div>
    </MapCell>
  ));
};
