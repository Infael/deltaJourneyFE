import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { exitFullscreen, startFullscreen } from "@/lib/fullscreenUtils";
import { ViewAtom } from "@/state/viewAtom";
import { useAtom } from "jotai";
import { useState } from "react";

export const ViewMenu = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const [viewAtom, setViewAtom] = useAtom(ViewAtom);

  const toggleHud = () => {
    setViewAtom((prev) => ({
      ...prev,
      showedHud: !prev.showedHud,
    }));
  };

  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => window.location.reload()}>
          Reload <MenubarShortcut>⌘R</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarCheckboxItem
          checked={fullscreen}
          onClick={() => {
            if (!fullscreen) {
              setFullscreen(true);
              startFullscreen();
            } else {
              setFullscreen(false);
              exitFullscreen();
            }
          }}
        >
          Fullscreen
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={viewAtom.showedHud} onClick={toggleHud}>
          Header & Footer
        </MenubarCheckboxItem>
        <MenubarCheckboxItem
          checked={fullscreen && !viewAtom.showedHud}
          onClick={() => {
            if (!fullscreen || viewAtom.showedHud) {
              setFullscreen(true);
              startFullscreen();
              setViewAtom((prev) => ({
                ...prev,
                showedHud: false,
              }));
            } else {
              setFullscreen(false);
              exitFullscreen();
              setViewAtom((prev) => ({
                ...prev,
                showedHud: true,
              }));
            }
          }}
        >
          Presentation mode
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
