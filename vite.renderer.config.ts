import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
    build: {
        assetsInlineLimit: 0,
    },
    resolve: {
        alias: {
            "@erpel": path.resolve(__dirname, "./src"),
        },
    },
});
