import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "./src/main.ts"),
			name: "@elmunleashed/core",
			// the proper extensions will be added
			fileName: "index",
		},
	},
});
