import { useUploadDriveFileCreate } from "@/api/driveApi/custom-drive-api";
import { getDriveFilesListQueryKey } from "@/api/driveApi/drive-api";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/useForm";
import { Routes } from "@/router/routes";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const newProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  storage: z.enum(["local", "drive"], {
    errorMap: () => ({ message: "Storage type is required" }),
  }),
});

interface NewProjectFormProps {
  onCreate: () => void;
}

export const NewProjectForm: FC<NewProjectFormProps> = ({ onCreate }) => {
  const navigate = useNavigate();
  const { mutateAsync: createFile, isPending } = useUploadDriveFileCreate();

  const createNewFile = (name: string) => {
    console.log(name);
    const fileMetadata = {
      name: `${name}.dj`,
      mimeType: "application/json",
    };
    const fileContent = JSON.stringify({ message: "Hello world" });

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
    formData.append("file", new File([fileContent], `${name}.dj`, { type: "application/json" }));

    const metadataBlob = formData.get("file") as Blob;
    metadataBlob.text().then(console.log);

    createFile({ data: formData, params: { uploadType: "multipart" } })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: getDriveFilesListQueryKey() });
      })
      .finally(() => {
        onCreate();
      });
  };

  const form = useAppForm({
    defaultValues: {
      projectName: "New Project",
      storage: "drive",
    },
    validators: {
      onChange: newProjectSchema,
    },
    onSubmit: (values) => {
      if (values.value.storage === "local") {
        navigate(Routes.PROJECT_PAGE);
      } else if (values.value.storage === "drive") {
        console.log(values);
        createNewFile(values.value.projectName);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.AppField name="projectName">
        {(field) => <field.TextField label="Enter the name for your new Project:" />}
      </form.AppField>

      <form.AppField name="storage">
        {(field) => (
          <field.RadioGroupField
            label="Select storage:"
            items={[
              {
                label: "Google Drive",
                value: "drive",
              },
              {
                label: "On your machine",
                value: "local",
              },
            ]}
          />
        )}
      </form.AppField>

      <Button type="submit" disabled={isPending}>
        Create
      </Button>
    </form>
  );
};
