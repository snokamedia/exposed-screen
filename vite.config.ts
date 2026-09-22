import { defineConfig } from "vite";

export default defineConfig({
	// Project Pages serve from /<repo>/, so production builds for Pages set
	// PAGES_BASE=/exposed-screen/. Local dev, preview, and tests use "/".
	base: process.env.PAGES_BASE ?? "/",
	build: {
		outDir: "dist",
		sourcemap: true,
		target: "es2022",
		chunkSizeWarningLimit: 60,
	},
	server: {
		host: "127.0.0.1",
		port: 5173,
	},
	preview: {
		host: "127.0.0.1",
		port: 8901,
	},
});
