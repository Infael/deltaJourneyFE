import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateNewVersionProjectCommand } from "@/lib/project/commands/createNewVersionProjectCommand";
import { projectAtom } from "@/state/projectAtom";
import { useAtom } from "jotai";

export const ControlBarVersionControl = () => {
  const [{ current }, setProject] = useAtom(projectAtom);

  return (
    <div className="flex gap-4">
      <Select
        defaultValue={current.actualShowedVersion}
        onValueChange={(value) => setProject((prev) => ({ ...prev, actualShowedVersion: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Last Version" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {current.project.versions.map((version) => (
              <SelectItem key={version.id} value={version.id}>
                {version.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        variant="noShadow"
        onClick={() => {
          setProject((prev) => {
            const newProject = new CreateNewVersionProjectCommand().execute(prev.current.project, {
              name: `Version ${prev.current.project.versions.length + 1}`,
            });
            return {
              ...prev,
              project: newProject,
              actualShowedVersion: newProject.versions[newProject.versions.length - 1].id,
            };
          });
        }}
      >
        Create New Version
      </Button>
      <Button variant="noShadow">Compare with</Button>
    </div>
  );
};
