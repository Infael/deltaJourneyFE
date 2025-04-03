import { useUploadDriveFileCreate } from "@/api/driveApi/custom-drive-api";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/useForm";
import { Routes } from "@/router/routes";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const newProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  storage: z.enum(["local", "drive"], {
    errorMap: () => ({ message: "Storage type is required" }),
  }),
});

export const NewProjectForm = () => {
  const navigate = useNavigate();
  const { mutate: createFile, isPending } = useUploadDriveFileCreate();

  const createNewFile = async (name: string) => {
    const fileMetadata = {
      name: `${name}.dj`,
      mimeType: "application/json",
    };
    const fileContent = JSON.stringify({ message: "Hello world" });

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
    formData.append("file", new Blob([fileContent], { type: "application/json" }));

    createFile({ data: formData, params: { uploadType: "multipart" } });
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
