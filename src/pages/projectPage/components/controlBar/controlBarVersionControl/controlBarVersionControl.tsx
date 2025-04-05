import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ControlBarVersionControl = () => {
  return (
    <div className="flex gap-4">
      <Select defaultValue="version1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="version1">Version 1</SelectItem>
            <SelectItem value="version2">Version 2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button variant="noShadow">Create New Version</Button>
      <Button variant="noShadow">Compare with</Button>
    </div>
  );
};
