import {
  GaNumericMetricData,
  ManualNumericMetricData,
  MetricType,
  NumericMetricData,
  NumericMetricKey,
} from "@/lib/project/models/metrics";
import { Project } from "@/lib/project/models/project";

interface CommandData {
  metricId: string;
  touchpointId: string;
  value: NumericMetricData;
  versionId: string;
}

const roundIfNeeded = (value: number | null): number | null => {
  if (value === null) return null;
  return Number.isInteger(value) ? value : Number(value.toFixed(2));
};

const createMetricData = (data: CommandData): NumericMetricData => {
  const common: {
    id: string;
    key: MetricType.NUMERIC;
    value: number | null;
    graphSettings: NumericMetricData["graphSettings"];
    valueSettings: NumericMetricData["valueSettings"];
  } = {
    id: data.metricId,
    key: MetricType.NUMERIC,
    value: roundIfNeeded(data.value.value),
    graphSettings: {
      color: data.value.graphSettings.color,
      hidden: data.value.graphSettings.hidden,
    },
    valueSettings: {
      color: data.value.valueSettings.color,
      hidden: data.value.valueSettings.hidden,
      prefix: data.value.valueSettings.prefix,
      suffix: data.value.valueSettings.suffix,
    },
  };

  if (data.value.numericTypeKey === NumericMetricKey.MANUAL) {
    const manualMetric: ManualNumericMetricData = {
      ...common,
      numericTypeKey: NumericMetricKey.MANUAL,
      manualProperties: {
        range: {
          min: data.value.manualProperties?.range.min ?? 0,
          max: data.value.manualProperties?.range.max ?? 100,
        },
      },
    };
    return manualMetric;
  }

  if (data.value.numericTypeKey === NumericMetricKey.GA) {
    const gaMetric: GaNumericMetricData = {
      ...common,
      numericTypeKey: NumericMetricKey.GA,
      gaProperties: {
        property: data.value.gaProperties?.property ?? "",
        metric: data.value.gaProperties?.metric ?? "",
      },
    };
    return gaMetric;
  }

  throw new Error("Invalid metric type");
};

export const updateNumericMetricValueCommand = (project: Project, data: CommandData): Project => {
  const versionIndex = project.versions.findIndex((v) => v.id === data.versionId);
  if (versionIndex === -1) throw new Error("Version not found");

  const version = project.versions[versionIndex];
  const touchpointIndex = version.touchpoints.findIndex((t) => t.id === data.touchpointId);
  if (touchpointIndex === -1) throw new Error("Touchpoint not found");

  const touchpoint = version.touchpoints[touchpointIndex];

  const updatedTouchpoint = {
    ...touchpoint,
    metricsData: [...touchpoint.metricsData.filter((m) => m.id !== data.metricId), createMetricData(data)],
  };

  const updatedVersion = {
    ...version,
    touchpoints: [
      ...version.touchpoints.slice(0, touchpointIndex),
      updatedTouchpoint,
      ...version.touchpoints.slice(touchpointIndex + 1),
    ],
    modifiedTime: new Date().toISOString(),
  };

  return {
    ...project,
    versions: [...project.versions.slice(0, versionIndex), updatedVersion, ...project.versions.slice(versionIndex + 1)],
    modifiedTime: new Date().toISOString(),
  };
};
