import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateNewVersionProjectCommand } from "@/lib/project/commands/createNewVersionProjectCommand";
import { projectAtom } from "@/state/projectAtom";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom, useSetAtom } from "jotai";

export const ControlBarVersionControl = () => {
  const [{ current }, setProject] = useAtom(projectAtom);
  const updateProject = useSetAtom(projectWriteAtom);

  return (
    <div className="flex gap-4">
      <Select
        defaultValue={current.actualShowedVersion}
        onValueChange={(value) =>
          setProject((prev) => ({ ...prev, current: { ...prev.current, actualShowedVersion: value } }))
        }
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
          updateProject((prev) => {
            const newProject = new CreateNewVersionProjectCommand().execute(prev.project, {
              name: `Version ${prev.project.versions.length + 1}`,
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
