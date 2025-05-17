import { Paragraph } from "@/components/ui/paragraph";
import { NumericMetricData, NumericMetricKey } from "@/lib/project/models/metrics";
import { compareStateAtom } from "@/state/compareStateAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { MetricDataWithTouchpoint } from "../../metric";
import { EmptyNumericMetric } from "./emptyNumericMetric";
import { NumericMetricFieldReload } from "./numericMetricFieldReload";
import { NumericMetricFormDialog } from "./numericMetricFormDialog";

interface NumericMetricFieldProps {
  metricData: MetricDataWithTouchpoint<NumericMetricData>;
  height: number;
}

export const NumericMetricField: FC<NumericMetricFieldProps> = ({ metricData, height }) => {
  const { presentationMode, editable } = useAtomValue(viewAtom);
  const { activated, currentVersionColor, selectedVersionColor } = useAtomValue(compareStateAtom);
  const data = metricData.metricData;

  if (!data) {
    return presentationMode || !editable ? null : (
      <EmptyNumericMetric metricId={metricData.metricId} touchpointId={metricData.touchpointId} />
    );
  }

  const renderValueParagraph = (value: number) =>
    !data.valueSettings.hidden && (
      <Paragraph
        style={{
          color: data.valueSettings.color,
        }}
      >
        {data.valueSettings.prefix}
        {value}
        {data.valueSettings.suffix}
      </Paragraph>
    );

  const renderManualGraph = (value: number, color: string) => {
    if (data.numericTypeKey !== NumericMetricKey.MANUAL) return null;

    const min = data.manualProperties?.range.min ?? 0;
    const max = data.manualProperties?.range.max ?? 100;
    const clampedValue = Math.max(min, Math.min(value, max));
    const percent = (clampedValue - min) / (max - min);
    const y = height - percent * height;

    return (
      !data.graphSettings.hidden && (
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          className="absolute top-0 left-0"
        >
          <defs>
            <linearGradient
              id={`${metricData.metricId}-${metricData.touchpointId}-${color}-gradient-under-line`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y={y}
            width="100%"
            height={height - y}
            fill={`url(#${metricData.metricId}-${metricData.touchpointId}-${color}-gradient-under-line)`}
          />
          <line x1="0" y1={y} x2="100%" y2={y} stroke={color} strokeWidth="2" />
        </svg>
      )
    );
  };

  return (
    <div className="flex h-full w-full">
      {activated && (
        <div
          className="relative flex flex-1 border-r-1 border-dashed"
          style={{ backgroundColor: data.graphSettings.hidden ? selectedVersionColor : "transparent" }}
        >
          <div className="flex flex-1 items-center justify-center">
            {renderValueParagraph(metricData.comparedMetricData?.value ?? 0)}
            {data.numericTypeKey === NumericMetricKey.MANUAL &&
              renderManualGraph(metricData.comparedMetricData?.value ?? 0, selectedVersionColor)}
          </div>
        </div>
      )}
      <div
        className="relative flex flex-1"
        style={{ backgroundColor: data.graphSettings.hidden && activated ? currentVersionColor : "transparent" }}
      >
        <NumericMetricFormDialog
          metricId={metricData.metricId}
          touchpointId={metricData.touchpointId}
          defaultValue={data}
        >
          {renderValueParagraph(data.value ?? 0)}
          {data.numericTypeKey === NumericMetricKey.MANUAL &&
            renderManualGraph(data.value ?? 0, activated ? currentVersionColor : data.graphSettings.color)}
          {data.numericTypeKey === NumericMetricKey.GA && <NumericMetricFieldReload metricData={metricData} />}
        </NumericMetricFormDialog>
      </div>
    </div>
  );
};
