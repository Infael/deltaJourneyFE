import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

import { Project } from "@/lib/project/models/project";
import { Routes } from "@/router/routes";
import { projectAtom } from "@/state/projectAtom";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import thisDeviceIcon from "./assets/thisDevice.svg";

export const OpenLocallyCard = () => {
  const navigate = useNavigate();
  const saveFileToState = useSetAtom(projectAtom);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const project = JSON.parse(e.target?.result as string) as unknown as Project;
        saveFileToState({
          current: {
            project: project,
            projectMetadata: {
              id: file.name,
              name: file.name.split(".")[0],
              createdTime: new Date().toISOString(),
              modifiedTime: new Date().toISOString(),
              owners: [{ displayName: "Local User" }],
            },
            projectStorage: "local",
            actualShowedVersion: project.versions[0].id,
          },
          past: [],
          future: [],
        });
        navigate(Routes.PROJECT_PAGE);
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <input id="file" className="hidden" type="file" accept=".dj" onChange={handleFileChange} />
      <label htmlFor="file">
        <Card
          className="hover:translate-x-boxShadowX hover:translate-y-boxShadowY w-64 cursor-default hover:shadow-none"
          onClick={() => {}}
        >
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-8">
            <img
              src={thisDeviceIcon}
              alt="open local file
              "
              className="size-36"
            />
            <Heading level="h3">Open Local File</Heading>
          </div>
        </Card>
      </label>
    </>
  );
};
