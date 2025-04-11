import { MutationFunction, useMutation } from "@tanstack/react-query";
import { fetchClient } from "../fetchClient";
import { DriveFilesCreateParams, File } from "./drive-api.schemas";

const driveFileCreate = (fileWithMetadata: FormData, params?: DriveFilesCreateParams) => {
  return fetchClient<File>({
    url: "https://www.googleapis.com/upload/drive/v3/files",
    method: "POST",
    data: fileWithMetadata,
    params: params,
  });
};

export const useUploadDriveFileCreate = () => {
  const mutationKey = ["uploadDriveFileCreate"];
  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof driveFileCreate>>,
    { data: FormData; params?: DriveFilesCreateParams }
  > = (props) => {
    const { data, params } = props ?? {};

    return driveFileCreate(data, params);
  };
  const mutationOptions = {
    mutationKey,
    mutationFn,
  };

  return useMutation({
    ...mutationOptions,
  });
};

const driveFileUpdate = (fileId: string, fileWithMetadata: FormData, params?: DriveFilesCreateParams) => {
  return fetchClient<File>({
    url: `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
    method: "PATCH",
    data: fileWithMetadata,
    params: params,
  });
};

export const useUploadDriveFileUpdate = () => {
  const mutationKey = ["uploadDriveFileUpdate"];
  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof driveFileUpdate>>,
    { fileId: string; data: FormData; params?: DriveFilesCreateParams }
  > = (props) => {
    const { fileId, data, params } = props ?? {};

    return driveFileUpdate(fileId, data, params);
  };
  const mutationOptions = {
    mutationKey,
    mutationFn,
  };

  return useMutation({
    ...mutationOptions,
  });
};
