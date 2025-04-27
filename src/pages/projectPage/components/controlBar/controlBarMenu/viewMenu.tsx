import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useViewControl } from "@/hooks/useViewControl";

export const ViewMenu = () => {
  const { fullscreen, view, toggleFullscreen, toggleHud, togglePresentationMode } = useViewControl();

  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => window.location.reload()}>
          Reload <MenubarShortcut>⌘R</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarCheckboxItem checked={fullscreen} onClick={toggleFullscreen}>
          Fullscreen
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={view.showedHud} onClick={toggleHud}>
          Header & Footer
        </MenubarCheckboxItem>
        <MenubarCheckboxItem checked={fullscreen && !view.showedHud} onClick={togglePresentationMode}>
          Presentation mode
        </MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
