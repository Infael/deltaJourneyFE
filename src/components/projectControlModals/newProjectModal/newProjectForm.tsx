import { useUploadDriveFileCreate } from "@/api/driveApi/custom-drive-api";
import { getDriveFilesListQueryKey } from "@/api/driveApi/drive-api";
import { queryClient } from "@/api/queryClient";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/useForm";
import { createEmptyProject, projectToJSON } from "@/lib/project/services/ProjectService";
import { Routes } from "@/router/routes";
import { projectAtom } from "@/state/projectAtom";
import { useSetAtom } from "jotai";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const newProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  storage: z.enum(["local", "drive"], {
    errorMap: () => ({ message: "Storage type is required" }),
  }),
});

interface NewProjectFormProps {
  onCreate: (newProjectId: string) => void;
}

export const NewProjectForm: FC<NewProjectFormProps> = ({ onCreate }) => {
  const navigate = useNavigate();
  const { mutateAsync: createFile, isPending } = useUploadDriveFileCreate();
  const addProjectToState = useSetAtom(projectAtom);

  const createNewFile = (name: string) => {
    const fileMetadata = {
      name: `${name}.dj`,
      mimeType: "application/json",
    };
    const fileContent = projectToJSON(createEmptyProject(name));

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
    formData.append("file", new File([fileContent], `${name}.dj`, { type: "application/json" }));

    toast.promise(
      createFile(
        { data: formData, params: { uploadType: "multipart" } },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: getDriveFilesListQueryKey() });
            onCreate(data.id!);
          },
        },
      ),
      {
        loading: "Creating new project...",
        success: "Project created successfully",
        error: "Error creating project",
      },
    );
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
        const newProject = createEmptyProject(values.value.projectName);

        addProjectToState({
          current: {
            project: newProject,
            projectMetadata: {
              id: "",
              name: values.value.projectName,
              createdTime: new Date().toISOString(),
              modifiedTime: new Date().toISOString(),
              owners: [],
            },
            projectStorage: "local",
            actualShowedVersion: newProject.versions[0].id,
          },
          past: [],
          future: [],
        });
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
