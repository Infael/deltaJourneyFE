import { cn } from "@/lib/utils";
import { viewAtom } from "@/state/viewAtom";
import { useAtomValue } from "jotai";
import { Paragraph } from "../../ui/paragraph";

export const Footer = () => {
  const { showedHud } = useAtomValue(viewAtom);

  return (
    <footer
      className={cn("flex w-full items-center justify-center border-t-4 bg-white py-4", showedHud ? "" : "hidden")}
    >
      <Paragraph variant="faded">Michal Štefaňák © 2025 DeltaJourney. All rights reserved.</Paragraph>
    </footer>
  );
};
