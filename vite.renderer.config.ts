import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
    build: {
        assetsInlineLimit: 0,
    },
    resolve: {
        alias: {
            "@erpel": path.resolve(__dirname, "./src")
        }
    }
});
