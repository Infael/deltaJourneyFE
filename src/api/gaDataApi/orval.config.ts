import { defineConfig } from "orval";

export default defineConfig({
  driveApi: {
    input: "gaDataApi/gaDataApi.yml",
    output: {
      mode: "split",
      target: "gaDataApi/gaDataApi.ts",
      client: "react-query",
      mock: false,
      baseUrl: "https://analyticsdata.googleapis.com/",
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
