import { mergeConfig } from "vitest/config";
import baseConfig from "./vite.renderer.config";

export default mergeConfig(baseConfig, {
    test: {
        include: ["src/ui/**/*.test.{ts,tsx}"],
        browser: {
            enabled: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
        },
    },
});
