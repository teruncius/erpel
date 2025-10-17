import { mergeConfig } from "vitest/config";
import baseConfig from "./vite.main.config";

export default mergeConfig(baseConfig, {
    test: {
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["src/ui/", "src/renderer/"],
        environment: "node",
        coverage: {
            provider: "istanbul",
            reporter: ["json"],
            reportsDirectory: "./coverage/node",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/ui/", "src/renderer/"],
        },
    },
});
