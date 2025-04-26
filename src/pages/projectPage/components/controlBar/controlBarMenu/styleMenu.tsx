import {
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { mapStyleAtom, mapStyles } from "@/state/mapStyleAtom";
import { useAtom } from "jotai";

export const StyleMenu = () => {
  const [value, setValue] = useAtom(mapStyleAtom);

  return (
    <MenubarMenu>
      <MenubarTrigger>Style</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup
          value={value.key}
          onValueChange={(value) => setValue(mapStyles[value as keyof typeof mapStyles])}
        >
          <MenubarRadioItem value="light">Light</MenubarRadioItem>
          <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
          <MenubarRadioItem value="custom" disabled>
            Custom
          </MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  );
};
