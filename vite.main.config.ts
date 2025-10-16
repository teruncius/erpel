import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            "@erpel": path.resolve(__dirname, "./src"),
        },
    },
});
