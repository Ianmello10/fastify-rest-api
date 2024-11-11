import path from "path";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig({
	test: {
		environment:
			"./prisma/vitest-environment-prisma/prisma-test-environment.ts",
		include: ["src/http/controllers/**/**/*.spec.ts"],
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
		env: loadEnv("test", process.cwd(), ""),
	},
});
