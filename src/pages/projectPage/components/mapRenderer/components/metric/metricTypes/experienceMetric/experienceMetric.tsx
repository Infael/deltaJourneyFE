import { updateExperienceMetricValueCommand } from "@/lib/project/commands/metricCommands/experienceMetricCommands/updateExperienceMetricValueCommand";
import { ExperienceMetricData } from "@/lib/project/models/metrics";
import { MetricInfoExperience } from "@/lib/project/models/project";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtom, useAtomValue } from "jotai";
import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MapCell } from "../../../mapCell";
import { MetricDataWithTouchpoint } from "../../metric";
import { Circle } from "./circle";
import { Line } from "./line";

import { compareStateAtom } from "@/state/compareStateAtom";
import happy from "./assets/happy.svg";
import neutral from "./assets/neutral.svg";
import sad from "./assets/sad.svg";
import { Path } from "./path";

interface ExperienceMetricProps {
  metricInfo: MetricInfoExperience;
  metricData: MetricDataWithTouchpoint<ExperienceMetricData>[];
}

export const ExperienceMetric: FC<ExperienceMetricProps> = ({ metricInfo, metricData }) => {
  const [, updateProject] = useAtom(projectWriteAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellWidths, setCellWidths] = useState<number[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const { presentationMode, editable } = useAtomValue(viewAtom);
  const { activated, currentVersionColor, selectedVersionColor } = useAtomValue(compareStateAtom);

  const pathColor = useMemo(
    () => (activated ? currentVersionColor : metricInfo.path.color),
    [activated, currentVersionColor, metricInfo],
  );

  const onPointChange = (index: number, value: number) => {
    updateProject((prev) => {
      const newProject = updateExperienceMetricValueCommand(prev.project, {
        metricId: metricData[index].metricId,
        touchpointId: metricData[index].touchpointId,
        value: value,
        versionId: prev.actualShowedVersion,
      });
      return {
        ...prev,
        project: newProject,
      };
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const widths = metricData.map((cell) => cell.touchpointWidth);
    setCellWidths(widths);
  }, [metricData]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingIndex === null || !containerRef.current || presentationMode || !editable) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - bounds.top;

      // Clamp the Y value to be within the bounds of the chart
      const clampedY = Math.max(0, Math.min(relativeY, metricInfo.height));
      // Calculate the new value based on the Y position
      const newValue = 100 - (clampedY / metricInfo.height) * 100;

      onPointChange(draggingIndex, newValue);
    };

    const handleMouseUp = () => {
      setDraggingIndex(null);
    };

    if (draggingIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingIndex, metricInfo.height]);

  const metricValues = useMemo(() => metricData.map((d) => d.metricData?.value ?? 50), [metricData]);
  const comparedMetricValues = useMemo(() => metricData.map((d) => d.comparedMetricData?.value ?? 50), [metricData]);

  const getHoverPoints = (values: number[], cellWidths: number[], height: number) => {
    if (cellWidths.length === 0) return [];

    const cumulativeX = cellWidths.reduce<number[]>((acc, width, idx) => {
      const last = acc[idx - 1] ?? 0;
      acc.push(last + width);
      return acc;
    }, []);

    const chartHeight = height;

    return values.map((value, idx) => {
      const x = (cumulativeX[idx - 1] ?? 0) + (cellWidths[idx] ?? 0) / 2;
      const y = chartHeight - (value / 100) * chartHeight;
      return { x, y };
    });
  };

  const hoverPoints = useMemo(
    () => getHoverPoints(metricValues, cellWidths, metricInfo.height),
    [metricValues, cellWidths, metricInfo.height],
  );

  const comparedHoverPoints = useMemo(
    () => getHoverPoints(comparedMetricValues, cellWidths, metricInfo.height),
    [comparedMetricValues, cellWidths, metricInfo.height],
  );

  return (
    <MapCell gridSize={metricData.length} className="p-0">
      <div ref={containerRef} style={{ position: "relative", width: "100%", height: `${metricInfo.height}px` }}>
        <svg width="100%" height={metricInfo.height} style={{ position: "absolute", top: 0, left: 0 }}>
          <Path
            cellWidths={cellWidths}
            height={metricInfo.height}
            pathColor={pathColor}
            pathSmoothness={metricInfo.path.curveSmoothness}
            values={metricData.map((d) => d.metricData?.value ?? 50)}
          />
          {activated && (
            <Path
              cellWidths={cellWidths}
              height={metricInfo.height}
              pathColor={selectedVersionColor}
              pathSmoothness={metricInfo.path.curveSmoothness}
              values={metricData.map((d) => d.comparedMetricData?.value ?? 50)}
            />
          )}
          {!metricInfo.lines.hidden && (
            <>
              <Line height={metricInfo.height * metricInfo.lines.firstValue} />
              <Line height={metricInfo.height * metricInfo.lines.secondValue} />
            </>
          )}
          {hoverPoints.map((point, idx) => (
            <Fragment key={idx}>
              <Circle
                cx={point.x}
                cy={point.y}
                color={pathColor}
                onMouseDown={() => setDraggingIndex(idx)}
                disabled={presentationMode || !editable}
              />
              {!metricInfo.emojis.hidden && !activated && (
                <image
                  href={
                    point.y < metricInfo.height * metricInfo.lines.firstValue
                      ? happy
                      : point.y < metricInfo.height * metricInfo.lines.secondValue
                        ? neutral
                        : sad
                  }
                  x={point.x - 16}
                  y={point.y - 36 <= 0 ? point.y + 6 : point.y - 40}
                  height="32"
                  width="32"
                  style={
                    metricInfo.emojis.colors
                      ? {
                          filter:
                            point.y < metricInfo.height * metricInfo.lines.firstValue
                              ? "invert(41%) sepia(87%) saturate(1000%) hue-rotate(70deg) brightness(95%) contrast(110%)"
                              : point.y < metricInfo.height * metricInfo.lines.secondValue
                                ? ""
                                : "invert(35%) sepia(93%) saturate(1200%) hue-rotate(-10deg) brightness(95%) contrast(110%)",
                        }
                      : {}
                  }
                />
              )}
            </Fragment>
          ))}
          {activated &&
            comparedHoverPoints.map((point, idx) => (
              <Circle
                key={idx}
                cx={point.x}
                cy={point.y}
                color={selectedVersionColor}
                disabled={presentationMode || !editable}
              />
            ))}
        </svg>
      </div>
    </MapCell>
  );
};
