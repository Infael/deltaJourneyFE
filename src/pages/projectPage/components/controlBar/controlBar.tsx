import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { useProjectSave } from "@/hooks/useProjectSave";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { ControlBarMenu } from "./controlBarMenu/controlBarMenu";
import { ControlBarVersionControl } from "./controlBarVersionControl/controlBarVersionControl";

export const ControlBar: FC = () => {
  const {
    current: { projectMetadata },
  } = useAtomValue(projectAtom);

  const { savedProject, save } = useProjectSave();

  return (
    <div className="bg-bw flex w-full items-center justify-between border-b-4 px-8 py-4">
      <div className="flex items-center gap-8">
        <Heading level="h3">{projectMetadata.name?.split(".")[0]}</Heading>
        <ControlBarMenu />
        {!savedProject && (
          <Button onClick={() => save()} variant="noShadow" className="flex flex-col items-center gap-0">
            <Paragraph size="micro" className="p-0">
              project unsaved
            </Paragraph>
            <Paragraph size="small" weight="semibold" className="p-0">
              Save Project
            </Paragraph>
          </Button>
        )}
      </div>
      <ControlBarVersionControl />
    </div>
  );
};
