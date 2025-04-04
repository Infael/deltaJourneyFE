import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heading } from "@/components/ui/heading";
import { FC, useState } from "react";

import driveIcon from "../../assets/driveIcon.svg";
import { DeleteModal } from "./components/deleteModal";
import { MoreInfoModal } from "./components/moreInfoModal";
import { RenameModal } from "./components/renameModal";
import { ShareModal } from "./components/shareModal";

interface ProjectCardProps {
  id: string;
  projectName: string;
  createdAt: string;
  lastModified: string;
  owners: string[];
  storage: "drive" | "local" | "db";
  onClick: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({
  id,
  projectName,
  createdAt,
  lastModified,
  owners,
  storage,
  onClick,
}) => {
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

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
        <Heading level="h3">{projectName}</Heading>
        <div className="w-content flex flex-col gap-3">
          <Button onClick={onClick} variant="noShadow">
            Open Project
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="noShadowNeutral">More Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <DropdownMenuItem onClick={() => setMoreInfoModalOpen(true)}>More Info</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>Share</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-danger" onClick={() => setDeleteDialogOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <MoreInfoModal
            projectName={projectName}
            createdAt={createdAt}
            lastModified={lastModified}
            owners={owners}
            open={moreInfoModalOpen}
            setOpen={setMoreInfoModalOpen}
          />
          <RenameModal projectName={projectName} projectId={id} open={renameDialogOpen} setOpen={setRenameDialogOpen} />
          <DeleteModal projectId={id} open={deleteDialogOpen} setOpen={setDeleteDialogOpen} />
          <ShareModal projectId={id} open={shareDialogOpen} setOpen={setShareDialogOpen} />
        </div>
      </div>
    </Card>
  );
};
