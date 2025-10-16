import { mergeConfig } from "vitest/config";
import baseConfig from "./vite.main.config";

export default mergeConfig(baseConfig, {
    test: {
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["src/ui/**/*.test.{ts,tsx}"],
        environment: "node",
    },
});
