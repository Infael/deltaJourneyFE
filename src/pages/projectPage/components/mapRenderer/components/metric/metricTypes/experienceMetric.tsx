import { updateExperienceMetricValueCommand } from "@/lib/project/commands/metricCommands/experienceMetricCommands/updateExperienceMetricValueCommand";
import { ExperienceMetricData } from "@/lib/project/models/metrics";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom } from "jotai";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { MapCell } from "../../mapCell";
import { MetricDataWithTouchpoint } from "../metric";

interface ExperienceMetricProps {
  metricData: MetricDataWithTouchpoint<ExperienceMetricData>[];
  height: number;
}

export const ExperienceMetric: FC<ExperienceMetricProps> = ({ metricData, height }) => {
  const [, updateProject] = useAtom(projectWriteAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellWidths, setCellWidths] = useState<number[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

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
      if (draggingIndex === null || !containerRef.current) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - bounds.top;

      // Clamp the Y value to be within the bounds of the chart
      const clampedY = Math.max(0, Math.min(relativeY, height));
      // Calculate the new value based on the Y position
      const newValue = 100 - (clampedY / height) * 100;

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
  }, [draggingIndex, height]);

  const pathData = useMemo(() => {
    if (cellWidths.length === 0) return "";

    const cumulativeX = cellWidths.reduce<number[]>((acc, width, idx) => {
      const last = acc[idx - 1] ?? 0;
      acc.push(last + width);
      return acc;
    }, []);

    const chartHeight = height;

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

    const sharpnessFactor = 0.35;

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
  }, [metricData, height, cellWidths]);

  const hoverPoints = useMemo(() => {
    if (cellWidths.length === 0) return [];

    const cumulativeX = cellWidths.reduce<number[]>((acc, width, idx) => {
      const last = acc[idx - 1] ?? 0;
      acc.push(last + width);
      return acc;
    }, []);

    const chartHeight = height;

    return metricData.map((d, idx) => {
      const value = d.metricData && typeof d.metricData.value === "number" ? d.metricData.value : 50;
      const x = (cumulativeX[idx - 1] ?? 0) + (cellWidths[idx] ?? 0) / 2;
      const y = chartHeight - (value / 100) * chartHeight;
      return { x, y };
    });
  }, [metricData, height, cellWidths]);

  return (
    <MapCell gridSize={metricData.length} className="p-0">
      <div ref={containerRef} style={{ position: "relative", width: "100%", height: `${height}px` }}>
        <svg width="100%" height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id="experienceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="blue" stopOpacity="0.4" />
              <stop offset="100%" stopColor="blue" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={pathData} fill="url(#experienceGradient)" stroke="blue" strokeWidth="2" />
          {hoverPoints.map((point, idx) => (
            <circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="white"
              stroke="blue"
              strokeWidth="2"
              style={{ transition: "transform 0.2s", transformOrigin: "center center", cursor: "grab" }}
              onMouseEnter={(e) => {
                (e.target as SVGCircleElement).setAttribute("r", "7");
              }}
              onMouseLeave={(e) => {
                (e.target as SVGCircleElement).setAttribute("r", "4");
              }}
              onMouseDown={() => {
                setDraggingIndex(idx);
              }}
            />
          ))}
        </svg>
      </div>
    </MapCell>
  );
};
