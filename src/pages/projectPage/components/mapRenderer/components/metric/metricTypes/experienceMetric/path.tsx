import { FC, useMemo } from "react";

interface PathProps {
  values: number[];
  cellWidths: number[];
  height: number;
  pathSmoothness: number;
  pathColor: string;
}

export const Path: FC<PathProps> = ({ values, cellWidths, height, pathSmoothness, pathColor }) => {
  const id = useMemo(() => `path-${Math.random().toString(36).substring(2, 15)}`, []);

  const pathData = useMemo(() => {
    if (cellWidths.length === 0) return "";

    const cumulativeX = cellWidths.reduce<number[]>((acc, width, idx) => {
      const last = acc[idx - 1] ?? 0;
      acc.push(last + width);
      return acc;
    }, []);

    const chartHeight = height;

    const points = values.map((value, idx) => {
      const x = (cumulativeX[idx - 1] ?? 0) + (cellWidths[idx] ?? 0) / 2;
      const y = chartHeight - (value / 100) * chartHeight;
      return { x, y };
    });

    if (points.length === 0) return "";

    const totalWidth = cumulativeX[cumulativeX.length - 1] ?? 0;

    const fullPoints = [{ x: 0, y: points[0].y }, ...points, { x: totalWidth, y: points[points.length - 1].y }];

    let d = `M ${fullPoints[0].x},${chartHeight} `;
    d += `L ${fullPoints[0].x},${fullPoints[0].y} `;

    const sharpnessFactor = pathSmoothness;

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
  }, [cellWidths, height, pathSmoothness]);

  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pathColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={pathColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={pathData} fill={`url(#${id})`} stroke={pathColor} strokeWidth="2" />
    </>
  );
};
