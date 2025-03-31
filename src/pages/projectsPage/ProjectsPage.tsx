import { useUploadDriveFileCreate } from "@/api/driveApi/custom-drive-api";
import { useDriveFilesListSuspense } from "@/api/driveApi/drive-api";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";

export const ProjectPage = () => {
  const { data } = useDriveFilesListSuspense({
    orderBy: "modifiedTime,createdTime,name",
  });

  const { mutate: createFile } = useUploadDriveFileCreate();

  const createTestFile = async () => {
    const fileMetadata = {
      name: "test3.dj",
      mimeType: "application/json",
    };
    const fileContent = JSON.stringify({ message: "Hello world" });

    const formData = new FormData();
    formData.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
    formData.append("file", new Blob([fileContent], { type: "application/json" }));

    createFile({ data: formData, params: { uploadType: "multipart" } });
  };

  return (
    <div>
      <Heading level="h2">Your Client Journey Maps:</Heading>
      <Button onClick={createTestFile}>Create Test File</Button>
      {data.files?.length === 0 ? (
        <p>No maps found. Create a new one.</p>
      ) : (
        <ul>
          {data.files?.map((map) => (
            <li key={map.id}>
              <Paragraph>{map.name}</Paragraph>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
