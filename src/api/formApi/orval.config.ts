import { defineConfig } from "orval";

export default defineConfig({
  driveApi: {
    input: "formApi/formApi.yml",
    output: {
      mode: "split",
      target: "formApi/form-api.ts",
      client: "react-query",
      mock: false,
      baseUrl: "https://forms.googleapis.com/",
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
