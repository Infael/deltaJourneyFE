import { FC } from "react";

interface LineProps {
  height: number;
}

export const Line: FC<LineProps> = ({ height }) => {
  return <line x1="0" x2="100%" y1={height} y2={height} stroke="gray" strokeDasharray="4" strokeWidth="1" />;
};
