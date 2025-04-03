import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

import { Routes } from "@/router/routes";
import { useNavigate } from "react-router-dom";
import thisDeviceIcon from "./assets/thisDevice.svg";

export const OpenLocallyCard = () => {
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // save file to app state
    }
    navigate(Routes.PROJECT_PAGE);
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
