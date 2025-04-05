import { Menubar } from "@/components/ui/menubar";
import { EditMenu } from "./editMenu";
import { FileMenu } from "./fileMenu";
import { StyleMenu } from "./styleMenu";
import { ViewMenu } from "./viewMenu";

export const ControlBarMenu = () => {
  return (
    <Menubar>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
      <StyleMenu />
    </Menubar>
  );
};
