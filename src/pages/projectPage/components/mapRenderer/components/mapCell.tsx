import { resizeMetricProjectCommand } from "@/lib/project/commands/resizeMetricProjectCommand";
import { resizeTouchpointProjectCommand } from "@/lib/project/commands/resizeTouchpointProjectCommand";
import { cn } from "@/lib/utils";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useSetAtom } from "jotai";
import { FC, useRef } from "react";

interface MapCellProps {
  id?: string;
  children?: React.ReactNode;
  resizeVertical?: boolean;
  resizeHorizontal?: boolean;
  gridSize?: number;
  width?: number;
  height?: number;
  className?: string;
}

export const MapCell: FC<MapCellProps> = ({
  id,
  children,
  resizeVertical,
  resizeHorizontal,
  gridSize,
  width,
  height,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const updateProject = useSetAtom(projectWriteAtom);

  const handlePointerUp = () => {
    if (ref.current && id && (resizeVertical || resizeHorizontal)) {
      const rect = ref.current.getBoundingClientRect();

      if (resizeVertical) {
        const newWidth = Math.round(rect.width);
        updateProject((prev) => {
          const newProject = resizeTouchpointProjectCommand(prev.project, {
            versionId: prev.actualShowedVersion,
            touchpointId: id,
            newWidth: newWidth,
          });
          return {
            ...prev,
            project: newProject,
          };
        });
      }

      if (resizeHorizontal) {
        const newHeight = Math.round(rect.height);
        updateProject((prev) => {
          const newProject = resizeMetricProjectCommand(prev.project, {
            versionId: prev.actualShowedVersion,
            metricId: id,
            newHeight: newHeight,
          });
          return {
            ...prev,
            project: newProject,
          };
        });
      }
    }
  };

  return (
    <div
      ref={ref}
      onPointerUp={handlePointerUp}
      className={cn(
        resizeVertical && "resize-x",
        resizeHorizontal && "resize-y",
        "flex min-h-24 min-w-24 flex-col items-center gap-4 overflow-hidden p-2 outline",
        className,
      )}
      style={{ gridColumn: `span ${gridSize ?? 1}`, width, height }}
    >
      {children}
    </div>
  );
};
