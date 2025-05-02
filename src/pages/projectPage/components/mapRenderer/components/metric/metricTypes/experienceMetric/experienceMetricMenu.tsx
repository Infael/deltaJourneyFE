import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Paragraph } from "@/components/ui/paragraph";
import { Slider } from "@/components/ui/slider";

export const ExperienceMetricMenu = () => {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Settings</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Path</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="flex flex-col gap-1 px-2">
                <div className="flex items-center justify-between">
                  <Paragraph>Color</Paragraph> <input type="color" />
                </div>
                <DropdownMenuSeparator />
                <Paragraph>Curve smoothness</Paragraph>
                <Slider className="py-1" />
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Lines</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Hide</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="33">
                <DropdownMenuRadioItem value="33">33% - 66%</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="40">40% - 60%</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="50">50%</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Emojis</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Hide</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="black">
                <DropdownMenuRadioItem value="black">Black</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="colors">Color</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
};
