import { cn } from "@/lib/utils";
import { ViewAtom } from "@/state/viewAtom";
import { useAtomValue } from "jotai";
import { Paragraph } from "../../ui/paragraph";

export const Footer = () => {
  const viewAtom = useAtomValue(ViewAtom);

  return (
    <footer
      className={cn(
        "flex w-full items-center justify-center border-t-4 bg-white py-4",
        viewAtom.showedHud ? "" : "hidden",
      )}
    >
      <Paragraph variant="faded">Michal Štefaňák © 2025 DeltaJourney. All rights reserved.</Paragraph>
    </footer>
  );
};
