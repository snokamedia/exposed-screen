import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["tests/unit/**/*.test.ts"],
		exclude: ["node_modules", "dist", "tests/e2e/**"],
		environment: "node",
	},
});
