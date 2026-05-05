import { defineConfig } from "tsup";
export default defineConfig({
  entry: { index: "src/index.ts", cli: "src/cli.ts" },
  format: ["esm", "cjs"], dts: true, clean: true,
  sourcemap: true, target: "es2022",
  banner: { js: "#!/usr/bin/env node" },
  outExtension({ format }) { return { js: format === "cjs" ? ".cjs" : ".js" }; },
});
