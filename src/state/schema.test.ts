import { describe, expect, it } from "vitest";
import { z } from "zod";

import { DefaultConfig } from "./config";
import { BackgroundModeSchema, ConfigSchema, ServiceSchema, ServiceTemplateSchema } from "./schema";
import { BackgroundMode, DEFAULT_SERVICE_TEMPLATES } from "./settings";

describe("Schema", () => {
    describe("ConfigSchema", () => {
        it("parses default config without errors", () => {
            const result = z.safeParse(ConfigSchema, DefaultConfig);
            expect(result.success).toEqual(true);
            expect(result.data).toStrictEqual(DefaultConfig);
        });

        it("validates required fields", () => {
            const invalidConfig = { ...DefaultConfig };
            delete (invalidConfig as any).version;

            const result = z.safeParse(ConfigSchema, invalidConfig);
            expect(result.success).toEqual(false);
        });

        it("validates version is literal 0", () => {
            const invalidConfig = { ...DefaultConfig, version: 1 };

            const result = z.safeParse(ConfigSchema, invalidConfig);
            expect(result.success).toEqual(false);
        });

        it("validates boolean fields", () => {
            const invalidConfig = { ...DefaultConfig, isMuted: "not a boolean" };

            const result = z.safeParse(ConfigSchema, invalidConfig);
            expect(result.success).toEqual(false);
        });

        it("validates string fields", () => {
            const invalidConfig = { ...DefaultConfig, locale: 123 };

            const result = z.safeParse(ConfigSchema, invalidConfig);
            expect(result.success).toEqual(false);
        });

        it("validates array fields", () => {
            const invalidConfig = { ...DefaultConfig, services: "not an array" };

            const result = z.safeParse(ConfigSchema, invalidConfig);
            expect(result.success).toEqual(false);
        });

        it("validates background mode enum", () => {
            const invalidConfig = { ...DefaultConfig, mode: "invalid-mode" };

            const result = z.safeParse(ConfigSchema, invalidConfig);
            expect(result.success).toEqual(false);
        });

        it("accepts valid background mode values", () => {
            const colorConfig = { ...DefaultConfig, mode: BackgroundMode.Color };
            const wallpaperConfig = { ...DefaultConfig, mode: BackgroundMode.Wallpaper };

            const colorResult = z.safeParse(ConfigSchema, colorConfig);
            const wallpaperResult = z.safeParse(ConfigSchema, wallpaperConfig);

            expect(colorResult.success).toEqual(true);
            expect(wallpaperResult.success).toEqual(true);
        });
    });

    describe("ServiceTemplateSchema", () => {
        it("validates a complete service template", () => {
            const template = DEFAULT_SERVICE_TEMPLATES[0];
            const result = z.safeParse(ServiceTemplateSchema, template);

            expect(result.success).toEqual(true);
            expect(result.data).toStrictEqual(template);
        });

        it("validates required fields", () => {
            const invalidTemplate = { ...DEFAULT_SERVICE_TEMPLATES[0] };
            delete (invalidTemplate as any).id;

            const result = z.safeParse(ServiceTemplateSchema, invalidTemplate);
            expect(result.success).toEqual(false);
        });

        it("validates id is a string", () => {
            const invalidTemplate = { ...DEFAULT_SERVICE_TEMPLATES[0], id: 123 };

            const result = z.safeParse(ServiceTemplateSchema, invalidTemplate);
            expect(result.success).toEqual(false);
        });

        it("validates tags is an array of strings", () => {
            const invalidTemplate = { ...DEFAULT_SERVICE_TEMPLATES[0], tags: "not an array" };

            const result = z.safeParse(ServiceTemplateSchema, invalidTemplate);
            expect(result.success).toEqual(false);
        });

        it("validates option objects have required properties", () => {
            const invalidTemplate = {
                ...DEFAULT_SERVICE_TEMPLATES[0],
                name: { copyOnCreate: true }, // missing customizable and default
            };

            const result = z.safeParse(ServiceTemplateSchema, invalidTemplate);
            expect(result.success).toEqual(false);
        });

        it("validates option objects have correct types", () => {
            const invalidTemplate = {
                ...DEFAULT_SERVICE_TEMPLATES[0],
                name: {
                    copyOnCreate: "not boolean",
                    customizable: true,
                    default: "test",
                },
            };

            const result = z.safeParse(ServiceTemplateSchema, invalidTemplate);
            expect(result.success).toEqual(false);
        });
    });

    describe("ServiceSchema", () => {
        it("validates a complete service", () => {
            const template = DEFAULT_SERVICE_TEMPLATES[0];
            const service = {
                darkMode: null,
                icon: null,
                id: "test-id",
                name: null,
                template,
                url: null,
            };

            const result = z.safeParse(ServiceSchema, service);
            expect(result.success).toEqual(true);
            expect(result.data).toStrictEqual(service);
        });

        it("validates nullable fields can be null", () => {
            const template = DEFAULT_SERVICE_TEMPLATES[0];
            const service = {
                darkMode: null,
                icon: null,
                id: "test-id",
                name: null,
                template,
                url: null,
            };

            const result = z.safeParse(ServiceSchema, service);
            expect(result.success).toEqual(true);
        });

        it("validates nullable fields can have values", () => {
            const template = DEFAULT_SERVICE_TEMPLATES[0];
            const service = {
                darkMode: true,
                icon: "test-icon",
                id: "test-id",
                name: "Test Service",
                template,
                url: "https://example.com",
            };

            const result = z.safeParse(ServiceSchema, service);
            expect(result.success).toEqual(true);
        });

        it("validates required fields", () => {
            const template = DEFAULT_SERVICE_TEMPLATES[0];
            const invalidService = {
                darkMode: null,
                icon: null,
                name: null,
                template,
                url: null,
                // missing id
            };

            const result = z.safeParse(ServiceSchema, invalidService);
            expect(result.success).toEqual(false);
        });

        it("validates id is a string", () => {
            const template = DEFAULT_SERVICE_TEMPLATES[0];
            const invalidService = {
                darkMode: null,
                icon: null,
                id: 123, // should be string
                name: null,
                template,
                url: null,
            };

            const result = z.safeParse(ServiceSchema, invalidService);
            expect(result.success).toEqual(false);
        });

        it("validates template is a valid ServiceTemplate", () => {
            const invalidService = {
                darkMode: null,
                icon: null,
                id: "test-id",
                name: null,
                template: "not a template", // should be ServiceTemplate
                url: null,
            };

            const result = z.safeParse(ServiceSchema, invalidService);
            expect(result.success).toEqual(false);
        });
    });

    describe("BackgroundModeSchema", () => {
        it("validates Color mode", () => {
            const result = z.safeParse(BackgroundModeSchema, BackgroundMode.Color);
            expect(result.success).toEqual(true);
            expect(result.data).toEqual(BackgroundMode.Color);
        });

        it("validates Wallpaper mode", () => {
            const result = z.safeParse(BackgroundModeSchema, BackgroundMode.Wallpaper);
            expect(result.success).toEqual(true);
            expect(result.data).toEqual(BackgroundMode.Wallpaper);
        });

        it("rejects invalid mode", () => {
            const result = z.safeParse(BackgroundModeSchema, "invalid-mode");
            expect(result.success).toEqual(false);
        });

        it("rejects non-string values", () => {
            const result = z.safeParse(BackgroundModeSchema, 123);
            expect(result.success).toEqual(false);
        });
    });
});
