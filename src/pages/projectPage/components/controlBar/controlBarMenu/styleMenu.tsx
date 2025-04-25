import {
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";

export const StyleMenu = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger>Style</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup value="light">
          <MenubarRadioItem value="light">Light</MenubarRadioItem>
          <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
          <MenubarRadioItem value="custom">Custom</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  );
};
