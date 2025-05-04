import { defineConfig } from "orval";

export default defineConfig({
  driveApi: {
    input: "gaAdminApi/gaAdminApi.yml",
    output: {
      mode: "split",
      target: "gaAdminApi/gaAdminApi.ts",
      client: "react-query",
      mock: false,
      baseUrl: "https://analyticsadmin.googleapis.com/",
      override: {
        mutator: {
          path: "fetchClient.ts",
          name: "fetchClient",
        },
        query: {
          useSuspenseQuery: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier -cw",
    },
  },
});
