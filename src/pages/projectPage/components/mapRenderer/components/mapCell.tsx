import { resizeMetricCommand } from "@/lib/project/commands/metricCommands/resizeMetricCommand";
import { resizeTouchpointCommand } from "@/lib/project/commands/touchpointCommands/resizeTouchpointCommand";
import { cn } from "@/lib/utils";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, useEffect, useRef } from "react";

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
  const { presentationMode } = useAtomValue(viewAtom);
  const resizing = useRef(false);

  const handlePointerDown = () => {
    if (resizeVertical || resizeHorizontal) {
      resizing.current = true;
      document.addEventListener("pointerup", handlePointerUp);
    }
  };

  const handlePointerUp = () => {
    if (!resizing.current) return;

    resizing.current = false;
    document.removeEventListener("pointerup", handlePointerUp);

    if (ref.current && id) {
      const rect = ref.current.getBoundingClientRect();

      if (resizeVertical) {
        const newWidth = Math.round(rect.width);
        if (newWidth !== width) {
          updateProject((prev) => {
            const newProject = resizeTouchpointCommand(prev.project, {
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
      }

      if (resizeHorizontal) {
        const newHeight = Math.round(rect.height);
        if (newHeight !== height) {
          updateProject((prev) => {
            const newProject = resizeMetricCommand(prev.project, {
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
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      className={cn(
        !presentationMode && resizeVertical && "resize-x",
        !presentationMode && resizeHorizontal && "resize-y",
        "relative flex min-h-24 min-w-24 flex-col items-center justify-center overflow-hidden p-2 outline",
        className,
      )}
      style={{ gridColumn: `span ${gridSize ?? 1}`, width, height }}
    >
      {children}
    </div>
  );
};
