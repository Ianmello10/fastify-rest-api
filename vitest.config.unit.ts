import path from "path";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig({
	test: {
		include: ["./src/services/**/*.spec.ts"],
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
		env: loadEnv("test", process.cwd(), ""),
		//	globals: true,
	},
});
