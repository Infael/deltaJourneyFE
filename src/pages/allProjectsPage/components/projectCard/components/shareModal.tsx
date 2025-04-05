import {
  getDrivePermissionsListQueryKey,
  useDrivePermissionsCreate,
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

  const { mutateAsync: createPermission, isPending } = useDrivePermissionsCreate();

  const form = useAppForm({
    defaultValues: {
      shareWith: "",
      role: "writer",
    },
    validators: {
      onChange: z.object({
        shareWith: z.string().email("Invalid email address"),
        role: z.enum(["writer", "reader"], {
          errorMap: () => ({ message: "Role is required" }),
        }),
      }),
    },
    onSubmit: (values) => {
      createPermission({
        fileId: projectId,
        data: {
          emailAddress: values.value.shareWith,
          role: values.value.role,
          type: "user",
        },
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: getDrivePermissionsListQueryKey(projectId) });
          form.reset();
        })
        .catch((error) => {
          console.error("Error creating permission:", error);
        });
    },
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
        <Paragraph>Share with a new user:</Paragraph>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-row justify-between gap-8"
        >
          <form.AppField name="shareWith">{(field) => <field.TextField placeholder="Enter email" />}</form.AppField>
          <div className="flex gap-4">
            <form.AppField name="role">
              {(field) => (
                <field.SelectField
                  items={[
                    {
                      label: "Writer",
                      value: "writer",
                    },
                    {
                      label: "Reader",
                      value: "reader",
                    },
                  ]}
                />
              )}
            </form.AppField>
            <Button type="submit" disabled={isPending} className="w-[88px]">
              Share
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
