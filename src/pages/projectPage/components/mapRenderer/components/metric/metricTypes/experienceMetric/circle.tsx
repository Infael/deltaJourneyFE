import { FC } from "react";

interface CircleProps {
  cx: number;
  cy: number;
  color?: string;
  onMouseDown: () => void;
}

export const Circle: FC<CircleProps> = ({ cx, cy, color = "blue", onMouseDown }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="white"
      stroke={color}
      strokeWidth="2"
      style={{ transition: "transform 0.2s", transformOrigin: "center center", cursor: "grab" }}
      onMouseEnter={(e) => {
        (e.target as SVGCircleElement).setAttribute("r", "7");
      }}
      onMouseLeave={(e) => {
        (e.target as SVGCircleElement).setAttribute("r", "4");
      }}
      onMouseDown={onMouseDown}
    />
  );
};
