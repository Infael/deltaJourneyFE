import {
  getDrivePermissionsListQueryKey,
  useDrivePermissionsDelete,
  useDrivePermissionsListSuspense,
  useDrivePermissionsUpdate,
} from "@/api/driveApi/drive-api";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/paragraph";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppForm } from "@/hooks/useForm";
import { FC } from "react";
import { z } from "zod";

interface ShareModalProps {
  projectId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ShareModal: FC<ShareModalProps> = ({ projectId, open, setOpen }) => {
  const { data: filePermissions } = useDrivePermissionsListSuspense(projectId, {
    fields: "permissions(id,emailAddress,role,type)",
  });

  const { mutateAsync: updatePermission } = useDrivePermissionsUpdate();

  const handleUpdatePermission = (permissionId: string, role: string) => {
    updatePermission({
      fileId: projectId,
      permissionId,
      data: {
        role: role,
      },
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: getDrivePermissionsListQueryKey(projectId) });
    });
  };

  const { mutateAsync: deletePermission } = useDrivePermissionsDelete();

  const handleDeletePermission = (permissionId: string) => {
    deletePermission({
      fileId: projectId,
      permissionId,
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: getDrivePermissionsListQueryKey(projectId) });
    });
  };

  const form = useAppForm({
    defaultValues: {
      sharedWith:
        filePermissions?.permissions
          ?.filter((permission) => permission.type === "user" && permission.role !== "owner")
          .map((permission) => ({
            id: permission.id,
            emailAddress: permission.emailAddress,
            role: permission.role,
          })) ?? [],
    },
    validators: {
      onChange: z.object({
        sharedWith: z.array(z.object({ id: z.string(), emailAddress: z.string(), role: z.string() })),
      }),
    },
    onSubmit: (values) => {},
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription className="hidden">Dialog for sharing the project</DialogDescription>
        </DialogHeader>
        {filePermissions?.permissions
          ?.filter((permission) => permission.type === "user" && permission.role !== "owner")
          .map((permission) => (
            <div key={permission.id} className="flex items-center justify-between gap-16">
              <Paragraph>{permission.emailAddress}</Paragraph>
              <div className="flex items-center justify-between gap-4">
                <Select
                  defaultValue={permission.role}
                  onValueChange={(value) => handleUpdatePermission(permission.id!, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue defaultValue={permission.role} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="writer">Writer</SelectItem>
                      <SelectItem value="reader">Reader</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button variant="danger" onClick={() => handleDeletePermission(permission.id!)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <Button type="submit" className="w-full" disabled={false}>
            Share
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
