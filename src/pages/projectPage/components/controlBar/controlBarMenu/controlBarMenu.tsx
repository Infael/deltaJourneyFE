import { Menubar } from "@/components/ui/menubar";
import { EditMenu } from "./editMenu";
import { FileMenu } from "./fileMenu";
import { FormMenu } from "./formMenu";
import { StyleMenu } from "./styleMenu";
import { VersionMenu } from "./versionMenu";
import { ViewMenu } from "./viewMenu";

export const ControlBarMenu = () => {
  return (
    <Menubar>
      <FileMenu />
      <VersionMenu />
      <EditMenu />
      <ViewMenu />
      <StyleMenu />
      <FormMenu />
    </Menubar>
  );
};
