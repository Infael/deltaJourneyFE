import { FC } from "react";

interface CircleProps {
  cx: number;
  cy: number;
  color: string;
  onMouseDown?: () => void;
  disabled?: boolean;
}

export const Circle: FC<CircleProps> = ({ cx, cy, color, onMouseDown, disabled }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="white"
      stroke={color}
      strokeWidth="2"
      style={{ transition: "transform 0.2s", transformOrigin: "center center", cursor: disabled ? "default" : "grab" }}
      onMouseDown={disabled ? undefined : onMouseDown}
    />
  );
};
