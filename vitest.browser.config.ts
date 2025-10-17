import { mergeConfig } from "vitest/config";
import baseConfig from "./vite.renderer.config";

export default mergeConfig(baseConfig, {
    test: {
        include: ["src/ui/**/*.test.{ts,tsx}", "src/preload-features/**/*.test.{ts,tsx}"],
        setupFilesAfterEnv: ["./vitest.setup.ts"],
        browser: {
            enabled: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
        },
        coverage: {
            provider: "istanbul",
            reporter: ["json"],
            reportsDirectory: "./coverage/browser",
            include: ["src/ui/**/*.{ts,tsx}", "src/preload-features/**/*.{ts,tsx}"],
            exclude: ["src/**/*.test.{ts,tsx}"],
        },
    },
    optimizeDeps: {
        include: ["react-dom/client", "darkreader"],
    },
});
