import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	reporter: "list",
	use: { baseURL: "http://127.0.0.1:8901", trace: "on-first-retry" },
	webServer: {
		command: "npm run preview",
		url: "http://127.0.0.1:8901",
		reuseExistingServer: true,
		timeout: 60_000,
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
