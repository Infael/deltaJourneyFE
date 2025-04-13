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
import { viewAtom } from "@/state/viewAtom";
import { useAtom } from "jotai";
import { useState } from "react";

export const ViewMenu = () => {
  const [fullscreen, setFullscreen] = useState(false);
  const [view, setViewAtom] = useAtom(viewAtom);

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
        <MenubarCheckboxItem checked={view.showedHud} onClick={toggleHud}>
          Header & Footer
        </MenubarCheckboxItem>
        <MenubarCheckboxItem
          checked={fullscreen && !view.showedHud}
          onClick={() => {
            if (!fullscreen || view.showedHud) {
              setFullscreen(true);
              startFullscreen();
              setViewAtom((prev) => ({
                ...prev,
                showedHud: false,
                presentationMode: true,
              }));
            } else {
              setFullscreen(false);
              exitFullscreen();
              setViewAtom((prev) => ({
                ...prev,
                showedHud: true,
                presentationMode: false,
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
