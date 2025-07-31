import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist/cdn",
        lib: {
            name: "ilw-filter",
            entry: "ilw-filter.ts",
            fileName: "ilw-filter",
            formats: ["es"],
        },
        rollupOptions: {
            output: {
                assetFileNames: (chunkInfo) => {
                    return "[name][extname]";
                },
            },
        },
    },
    server: {
        hmr: false,
    },
});
