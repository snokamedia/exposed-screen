import { defineConfig } from "vite";

export default defineConfig({
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
