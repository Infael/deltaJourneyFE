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

import happy from "./assets/happy.svg";
import neutral from "./assets/neutral.svg";
import sad from "./assets/sad.svg";

interface ExperienceMetricProps {
  metricInfo: MetricInfoExperience;
  metricData: MetricDataWithTouchpoint<ExperienceMetricData>[];
}

export const ExperienceMetric: FC<ExperienceMetricProps> = ({ metricInfo, metricData }) => {
  const [, updateProject] = useAtom(projectWriteAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellWidths, setCellWidths] = useState<number[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const { presentationMode } = useAtomValue(viewAtom);

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
      if (draggingIndex === null || !containerRef.current || presentationMode) return;

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

  const pathData = useMemo(() => {
    if (cellWidths.length === 0) return "";

    const cumulativeX = cellWidths.reduce<number[]>((acc, width, idx) => {
      const last = acc[idx - 1] ?? 0;
      acc.push(last + width);
      return acc;
    }, []);

    const chartHeight = metricInfo.height;

    const points = metricData.map((d, idx) => {
      const value = d.metricData && typeof d.metricData.value === "number" ? d.metricData.value : 50;
      const x = (cumulativeX[idx - 1] ?? 0) + (cellWidths[idx] ?? 0) / 2;
      const y = chartHeight - (value / 100) * chartHeight;
      return { x, y };
    });

    if (points.length === 0) return "";

    const totalWidth = cumulativeX[cumulativeX.length - 1] ?? 0;

    const fullPoints = [{ x: 0, y: points[0].y }, ...points, { x: totalWidth, y: points[points.length - 1].y }];

    let d = `M ${fullPoints[0].x},${chartHeight} `;
    d += `L ${fullPoints[0].x},${fullPoints[0].y} `;

    const sharpnessFactor = metricInfo.path.curveSmoothness;

    for (let i = 0; i < fullPoints.length - 1; i++) {
      const p0 = fullPoints[i];
      const p1 = fullPoints[i + 1];

      const controlPointDistance = (p1.x - p0.x) * sharpnessFactor;

      const controlPoint1 = { x: p0.x + controlPointDistance, y: p0.y };
      const controlPoint2 = { x: p1.x - controlPointDistance, y: p1.y };

      d += `C ${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${p1.x},${p1.y} `;
    }

    d += `L ${fullPoints.at(-1)!.x},${chartHeight} `;
    d += `Z`;

    return d;
  }, [metricData, metricInfo.height, cellWidths]);

  const hoverPoints = useMemo(() => {
    if (cellWidths.length === 0) return [];

    const cumulativeX = cellWidths.reduce<number[]>((acc, width, idx) => {
      const last = acc[idx - 1] ?? 0;
      acc.push(last + width);
      return acc;
    }, []);

    const chartHeight = metricInfo.height;

    return metricData.map((d, idx) => {
      const value = d.metricData && typeof d.metricData.value === "number" ? d.metricData.value : 50;
      const x = (cumulativeX[idx - 1] ?? 0) + (cellWidths[idx] ?? 0) / 2;
      const y = chartHeight - (value / 100) * chartHeight;
      return { x, y };
    });
  }, [metricData, metricInfo.height, cellWidths]);

  return (
    <MapCell gridSize={metricData.length} className="p-0">
      <div ref={containerRef} style={{ position: "relative", width: "100%", height: `${metricInfo.height}px` }}>
        <svg width="100%" height={metricInfo.height} style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id="experienceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metricInfo.path.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={metricInfo.path.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={pathData} fill="url(#experienceGradient)" stroke={metricInfo.path.color} strokeWidth="2" />
          {!metricInfo.lines.hidden && (
            <>
              <Line height={metricInfo.height * metricInfo.lines.firstValue} />
              <Line height={metricInfo.height * metricInfo.lines.secondValue} />
            </>
          )}
          {hoverPoints.map((point, idx) => (
            <Fragment key={idx}>
              <Circle cx={point.x} cy={point.y} onMouseDown={() => setDraggingIndex(idx)} />
              {!metricInfo.emojis.hidden && (
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
        </svg>
      </div>
    </MapCell>
  );
};
