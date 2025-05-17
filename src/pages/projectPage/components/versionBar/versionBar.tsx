import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { compareStateAtom } from "@/state/compareStateAtom";
import { currentProjectVersionAtom } from "@/state/projectWriteAtom";
import { useAtomValue } from "jotai";

export const VersionBar = () => {
  const versionData = useAtomValue(currentProjectVersionAtom);
  const { activated, selectedVersion, currentVersionColor, selectedVersionColor } = useAtomValue(compareStateAtom);

  if (!versionData) {
    return null;
  }

  return (
    <div className="flex self-end">
      {activated && selectedVersion && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="max-w-max translate-x-2 cursor-default rounded-bl-md border-2 border-t-0 border-r-0 bg-white px-2 pr-4"
                style={{ backgroundColor: selectedVersionColor }}
              >
                {selectedVersion.name} - from {new Date(selectedVersion.startDate).toLocaleDateString()} to{" "}
                {new Date(selectedVersion.endDate).toLocaleDateString()}
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={0}>Comparison</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="z-10 max-w-max rounded-bl-md border-2 border-t-0 border-r-0 bg-white px-2"
              style={{ backgroundColor: activated ? currentVersionColor : "white" }}
            >
              {versionData.name} - from {new Date(versionData.startDate).toLocaleDateString()} to{" "}
              {new Date(versionData.endDate).toLocaleDateString()}
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={0}>Current version</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
