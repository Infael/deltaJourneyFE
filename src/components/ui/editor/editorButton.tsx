import { cn } from "@/lib/utils";
import { FC } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

interface EditorButtonProps {
  icon: React.ReactNode;
  isActive: boolean;
  tooltipContent?: string;
  command: () => void;
}

export const EditorButton: FC<EditorButtonProps> = ({ icon, isActive, tooltipContent, command }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild disabled={!tooltipContent}>
          <button
            onClick={() => {
              command();
            }}
            className={cn(
              isActive ? "bg-main hover:bg-amber-200" : "hover:bg-gray-100",
              "flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-500",
            )}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
