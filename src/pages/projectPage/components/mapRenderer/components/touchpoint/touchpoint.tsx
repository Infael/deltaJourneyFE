import { Touchpoint as TouchpointType } from "@/lib/project/models/project";
import { viewAtom } from "@/state/viewAtom";

import { useAtomValue } from "jotai";
import { FC } from "react";
import { MapCell } from "../mapCell";
import { TouchpointDropdownMenu } from "./touchpointDropdownMenu";
import { TouchpointMenu } from "./touchpointMenu/touchpointMenu";

interface TouchpointProps {
  id: string;
  name: string;
  width: number;
  touchpoints: TouchpointType[];
}

export const Touchpoint: FC<TouchpointProps> = ({ id, name, width, touchpoints }) => {
  const { presentationMode, editable } = useAtomValue(viewAtom);

  return (
    <MapCell resizeVertical id={id} width={width} className="min-w-full">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        {!presentationMode && editable && (
          <div className="absolute top-1 right-1 flex">
            <TouchpointMenu id={id} />
            <TouchpointDropdownMenu id={id} name={name} touchpoints={touchpoints} />
          </div>
        )}
        <div>
          <h4 className="text-lg font-bold">{name}</h4>
        </div>
      </div>
    </MapCell>
  );
};
