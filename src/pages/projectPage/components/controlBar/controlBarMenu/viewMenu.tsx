import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export const ViewMenu = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          Reload <MenubarShortcut>⌘R</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Toggle Fullscreen</MenubarItem>
        <MenubarItem>Hide HUD</MenubarItem>
        <MenubarItem>Presentation mode</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
