import { fs, vol } from "memfs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DefaultConfig, loadConfig, saveConfig } from "./config";
import { DEFAULT_SIDE_BAR_IS_OPEN } from "./settings";

// Mock the fs/promises module to use memfs
vi.mock("node:fs/promises", () => ({
    readFile: vi.fn((path: string) => {
        try {
            const content = fs.readFileSync(path, "utf8");
            return Promise.resolve(content);
        } catch (error) {
            return Promise.reject(error);
        }
    }),
    writeFile: vi.fn((path: string, data: string) => {
        try {
            fs.writeFileSync(path, data, { encoding: "utf8" });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }),
}));

describe("Config", () => {
    beforeEach(() => {
        vi.stubGlobal("console", { error: vi.fn(), log: vi.fn(), warn: vi.fn() });
        vol.reset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const path = "/config.json";

    describe("loadConfig", () => {
        it("saves and loads the config to/from file", async () => {
            const config = { ...DefaultConfig, isOpen: !DEFAULT_SIDE_BAR_IS_OPEN };
            await saveConfig(path, config);

            const result = await loadConfig(path);
            expect(result).toEqual(config);
        });

        it("returns default config when file was not found", async () => {
            const result = await loadConfig(path);
            expect(result).toEqual(DefaultConfig);
        });

        it("returns default config when file could not be parsed", async () => {
            fs.writeFileSync(path, "{ invalid json");

            const result = await loadConfig(path);
            expect(result).toEqual(DefaultConfig);
        });

        it("returns default config when file contains invalid JSON", async () => {
            fs.writeFileSync(path, "not json at all");

            const result = await loadConfig(path);
            expect(result).toEqual(DefaultConfig);
        });

        it("returns default config when file contains invalid version", async () => {
            fs.writeFileSync(path, JSON.stringify({ version: "invalid" }));

            const result = await loadConfig(path);
            expect(result).toEqual(DefaultConfig);
        });

        it("returns default config when file contains missing version", async () => {
            fs.writeFileSync(path, JSON.stringify({}));

            const result = await loadConfig(path);
            expect(result).toEqual(DefaultConfig);
        });

        it("returns default config when file contains invalid schema", async () => {
            fs.writeFileSync(
                path,
                JSON.stringify({
                    version: 0,
                    invalidField: "test",
                    isMuted: "not a boolean",
                })
            );

            const result = await loadConfig(path);
            expect(result).toEqual(DefaultConfig);
        });

        it("successfully loads valid config", async () => {
            const validConfig = {
                ...DefaultConfig,
                isOpen: false,
                isMuted: true,
                locale: "de-DE",
            };
            fs.writeFileSync(path, JSON.stringify(validConfig));

            const result = await loadConfig(path);
            expect(result).toEqual(validConfig);
        });

        it("handles file read errors gracefully", async () => {
            const result = await loadConfig("/nonexistent/path");
            expect(result).toEqual(DefaultConfig);
        });
    });

    describe("saveConfig", () => {
        it("saves config to file successfully", async () => {
            const config = { ...DefaultConfig, isOpen: false };
            await saveConfig(path, config);

            const savedContent = fs.readFileSync(path, "utf8") as string;
            const parsedContent = JSON.parse(savedContent);
            expect(parsedContent).toEqual(config);
        });

        it("handles save errors gracefully", async () => {
            const config = { ...DefaultConfig };
            await expect(saveConfig("/readonly/path", config)).resolves.not.toThrow();
        });

        it("formats JSON with proper indentation", async () => {
            const config = { ...DefaultConfig };
            await saveConfig(path, config);

            const savedContent = fs.readFileSync(path, "utf8") as string;
            expect(savedContent).toContain("    "); // Check for 4-space indentation
            expect(savedContent).toContain("\n"); // Check for newlines
        });
    });

    describe("DefaultConfig", () => {
        it("has all required properties", () => {
            expect(DefaultConfig).toHaveProperty("dateFormat");
            expect(DefaultConfig).toHaveProperty("isMuted");
            expect(DefaultConfig).toHaveProperty("isOpen");
            expect(DefaultConfig).toHaveProperty("locale");
            expect(DefaultConfig).toHaveProperty("mode");
            expect(DefaultConfig).toHaveProperty("services");
            expect(DefaultConfig).toHaveProperty("timeFormat");
            expect(DefaultConfig).toHaveProperty("version");
            expect(DefaultConfig).toHaveProperty("wallpapers");
        });

        it("has correct default values", () => {
            expect(DefaultConfig.version).toBe(0);
            expect(DefaultConfig.isMuted).toBe(false);
            expect(DefaultConfig.isOpen).toBe(true);
            expect(DefaultConfig.locale).toBe("en-US");
            expect(DefaultConfig.dateFormat).toBe("en-US");
            expect(DefaultConfig.timeFormat).toBe("en-US");
            expect(Array.isArray(DefaultConfig.services)).toBe(true);
            expect(Array.isArray(DefaultConfig.wallpapers)).toBe(true);
        });
    });
});
