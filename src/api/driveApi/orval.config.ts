import { defineConfig } from "orval";

export default defineConfig({
  driveApi: {
    input: "driveApi/driveApi.yml",
    output: {
      mode: "split",
      target: "driveApi/drive-api.ts",
      client: "react-query",
      mock: false,
      baseUrl: "https://www.googleapis.com/drive/v3",
      override: {
        mutator: {
          path: "fetchClient.ts",
          name: "fetchClient",
        },
        query: {
          useSuspenseQuery: true,
        },
        operations: {
          "drive.files.get": {
            query: {
              useQuery: false,
              useSuspenseQuery: false,
              useMutation: true,
            },
          },
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier -cw",
    },
  },
});
