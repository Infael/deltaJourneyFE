import { Input } from "@/components/ui/input";
import {
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { compareStateAtom } from "@/state/compareStateAtom";
import { mapStyleAtom, mapStyles } from "@/state/mapStyleAtom";
import { useAtom } from "jotai";

export const StyleMenu = () => {
  const [value, setValue] = useAtom(mapStyleAtom);
  const [{ currentVersionColor, selectedVersionColor }, setCompareStateAtom] = useAtom(compareStateAtom);

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

          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Comparison colors</MenubarSubTrigger>
            <MenubarSubContent>
              <div className="flex items-center justify-between">
                Current
                <Input
                  className="w-[50px]"
                  type="color"
                  value={currentVersionColor}
                  onChange={(e) => setCompareStateAtom((prev) => ({ ...prev, currentVersionColor: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                Compared&nbsp;to
                <Input
                  className="w-[50px]"
                  type="color"
                  value={selectedVersionColor}
                  onChange={(e) => setCompareStateAtom((prev) => ({ ...prev, selectedVersionColor: e.target.value }))}
                />
              </div>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  );
};
