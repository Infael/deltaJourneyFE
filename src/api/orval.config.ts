import { defineConfig } from "orval";

import driveConfig from "./driveApi/orval.config";
import gaAdminConfig from "./gaAdminApi/orval.config";
import gaDataConfig from "./gaDataApi/orval.config";

export default defineConfig({
  ...driveConfig,
  ...gaAdminConfig,
  ...gaDataConfig,
});
