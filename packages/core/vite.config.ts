import { defineConfig } from "vite";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "./src/main.ts"),
			name: "@elmunleashed/core",
			// the proper extensions will be added
			fileName: "index",
			formats: ["es"],
		},
		rollupOptions: {
			external: [],
			plugins: [
				typescriptPaths({
					preserveExtensions: true,
				}),
				typescript({
					sourceMap: false,
					declaration: true,
					outDir: "dist",
				}),
			],
		},
	},
});
