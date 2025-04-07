import { Heading } from "@/components/ui/heading";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { ControlBarMenu } from "./controlBarMenu/controlBarMenu";
import { ControlBarVersionControl } from "./controlBarVersionControl/controlBarVersionControl";

export const ControlBar: FC = () => {
  const { projectMetadata } = useAtomValue(projectAtom);

  return (
    <div className="bg-bw flex w-full items-center justify-between border-b-4 px-8 py-4">
      <div className="flex items-center gap-8">
        <Heading level="h3">{projectMetadata.name?.split(".")[0]}</Heading>
        <ControlBarMenu />
      </div>
      <ControlBarVersionControl />
    </div>
  );
};
