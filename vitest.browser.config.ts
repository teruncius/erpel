import { mergeConfig } from "vitest/config";
import baseConfig from "./vite.renderer.config";

export default mergeConfig(baseConfig, {
    test: {
        include: ["src/ui/**/*.test.{ts,tsx}", "src/renderer/**/*.test.{ts,tsx}"],
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
            include: ["src/ui/**/*.{ts,tsx}", "src/renderer/**/*.{ts,tsx}"],
        },
    },
    optimizeDeps: {
        include: ["react-dom/client", "darkreader"],
    },
});
