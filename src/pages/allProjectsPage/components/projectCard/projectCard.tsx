import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/heading";
import { FC } from "react";

import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import driveIcon from "../../assets/driveIcon.svg";
import { RenameModal } from "./components/renameModal";

interface ProjectCardProps {
  id: string;
  title: string;
  storage: "drive" | "local" | "db";
  onClick: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ id, title, storage, onClick }) => {
  const getStorageIcon = () => {
    switch (storage) {
      case "drive":
        return driveIcon;
      case "local":
        return "";
      case "db":
        return "";
      default:
        return driveIcon;
    }
  };

  return (
    <Card variant="secondary" className="w-64">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <img src={getStorageIcon()} alt="Drive Icon" className="size-28" />
        <Heading level="h3">{title}</Heading>
        <div className="w-content flex flex-col gap-3">
          <Button onClick={onClick} variant="noShadow">
            Open Project
          </Button>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="noShadowNeutral">More Options</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DialogTrigger asChild>
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-danger">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <RenameModal projectName={title} projectId={id} />
          </Dialog>
        </div>
      </div>
    </Card>
  );
};
