import { mergeConfig } from "vitest/config";
import baseConfig from "./vite.main.config";

export default mergeConfig(baseConfig, {
    test: {
        global: true,
        browser: {
            enabled: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
        },
    },
});
