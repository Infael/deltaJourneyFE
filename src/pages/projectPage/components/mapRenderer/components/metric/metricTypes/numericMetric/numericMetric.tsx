import { NumericMetricData } from "@/lib/project/models/metrics";
import { FC } from "react";
import { MapCell } from "../../../mapCell";
import { MetricDataWithTouchpoint } from "../../metric";
import { NumericMetricField } from "./numericMetricField";

interface NumericMetricProps {
  height: number;
  metricData: MetricDataWithTouchpoint<NumericMetricData>[];
}

export const NumericMetric: FC<NumericMetricProps> = (props) => {
  return props.metricData.map((metric, index) => (
    <MapCell key={`${metric.metricData?.id}_${index}`} className="p-0">
      <NumericMetricField {...props} metricData={metric} />
    </MapCell>
  ));
};
