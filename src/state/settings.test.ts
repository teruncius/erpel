import { describe, expect, it } from "vitest";

import {
    BackgroundMode,
    DEFAULT_IS_MUTED,
    DEFAULT_LOCALE,
    DEFAULT_MODE,
    DEFAULT_SERVICE_TEMPLATES,
    DEFAULT_SERVICES,
    DEFAULT_SIDE_BAR_IS_OPEN,
    DEFAULT_WALLPAPERS,
    IconIdToUrl,
    ServiceFromTemplate,
} from "./settings";

describe("Settings", () => {
    describe("Default Constants", () => {
        it("default side bar is open", () => {
            expect(DEFAULT_SIDE_BAR_IS_OPEN).toBe(true);
        });

        it("default locale is en-US", () => {
            expect(DEFAULT_LOCALE).toBe("en-US");
        });

        it("default is not muted", () => {
            expect(DEFAULT_IS_MUTED).toBe(false);
        });

        it("default mode is wallpaper", () => {
            expect(DEFAULT_MODE).toBe(BackgroundMode.Wallpaper);
        });

        it("default wallpapers are available", () => {
            expect(DEFAULT_WALLPAPERS.length).toBe(7);
            expect(DEFAULT_WALLPAPERS.every((url) => typeof url === "string")).toBe(true);
            expect(DEFAULT_WALLPAPERS.every((url) => url.startsWith("https://"))).toBe(true);
        });

        it("default services are empty", () => {
            expect(DEFAULT_SERVICES.length).toBe(0);
            expect(Array.isArray(DEFAULT_SERVICES)).toBe(true);
        });

        it("default service templates are available", () => {
            expect(DEFAULT_SERVICE_TEMPLATES.length).toBe(9);
            expect(Array.isArray(DEFAULT_SERVICE_TEMPLATES)).toBe(true);
        });
    });

    describe("BackgroundMode enum", () => {
        it("has Color value", () => {
            expect(BackgroundMode.Color).toBe("color");
        });

        it("has Wallpaper value", () => {
            expect(BackgroundMode.Wallpaper).toBe("wallpaper");
        });

        it("has only two values", () => {
            const values = Object.values(BackgroundMode);
            expect(values).toHaveLength(2);
            expect(values).toContain("color");
            expect(values).toContain("wallpaper");
        });
    });

    describe("IconIdToUrl", () => {
        it("returns correct URL for known icon ID", () => {
            const [template] = DEFAULT_SERVICE_TEMPLATES;
            const url = IconIdToUrl(template.icon.default);

            expect(url).toBe("/resources/google-mail.png?no-inline");
        });

        it("returns empty string for unknown icon ID", () => {
            const url = IconIdToUrl("unknown-id");
            expect(url).toBe("");
        });

        it("returns empty string for empty icon ID", () => {
            const url = IconIdToUrl("");
            expect(url).toBe("");
        });

        it("returns URLs for all default service template icons", () => {
            const ids = DEFAULT_SERVICE_TEMPLATES.map((template) => template.icon.default);
            expect(ids.length).toBeGreaterThan(0);

            const urls = ids.map((id) => IconIdToUrl(id));
            expect(urls.length).toEqual(ids.length);
            expect(urls.every((url) => url.length > 0)).toBe(true);
        });

        it("handles null and undefined gracefully", () => {
            expect(IconIdToUrl(null as unknown as string)).toBe("");
            expect(IconIdToUrl(undefined as unknown as string)).toBe("");
        });
    });

    describe("ServiceFromTemplate", () => {
        it("creates service from template with null values when not customizable", () => {
            const [template] = DEFAULT_SERVICE_TEMPLATES;
            const service = ServiceFromTemplate(template);

            expect(service).toEqual({
                darkMode: null,
                icon: null,
                id: service.id,
                name: null,
                template,
                url: null,
            });
        });

        it("generates unique IDs for each service", () => {
            const [template] = DEFAULT_SERVICE_TEMPLATES;
            const service1 = ServiceFromTemplate(template);
            const service2 = ServiceFromTemplate(template);

            expect(service1.id).not.toBe(service2.id);
            expect(typeof service1.id).toBe("string");
            expect(typeof service2.id).toBe("string");
        });

        it("preserves template reference", () => {
            const [template] = DEFAULT_SERVICE_TEMPLATES;
            const service = ServiceFromTemplate(template);

            expect(service.template).toBe(template);
        });

        it("handles template with copyOnCreate and customizable options", () => {
            // Find a template with copyOnCreate: true and customizable: true
            const template = DEFAULT_SERVICE_TEMPLATES.find((t) => t.name.copyOnCreate && t.name.customizable);

            if (template) {
                const service = ServiceFromTemplate(template);
                expect(service.name).toBe(template.name.default);
            }
        });

        it("handles template with copyOnCreate but not customizable", () => {
            // Find a template with copyOnCreate: true but customizable: false
            const template = DEFAULT_SERVICE_TEMPLATES.find((t) => t.url.copyOnCreate && !t.url.customizable);

            if (template) {
                const service = ServiceFromTemplate(template);
                expect(service.url).toBe(template.url.default);
            }
        });

        it("handles template with customizable but not copyOnCreate", () => {
            // Find a template with customizable: true but copyOnCreate: false
            const template = DEFAULT_SERVICE_TEMPLATES.find((t) => !t.name.copyOnCreate && t.name.customizable);

            if (template) {
                const service = ServiceFromTemplate(template);
                expect(service.name).toBe(null);
            }
        });

        it("handles template with neither copyOnCreate nor customizable", () => {
            // Find a template with both copyOnCreate: false and customizable: false
            const template = DEFAULT_SERVICE_TEMPLATES.find((t) => !t.icon.copyOnCreate && !t.icon.customizable);

            if (template) {
                const service = ServiceFromTemplate(template);
                expect(service.icon).toBe(null);
            }
        });

        it("works with all default service templates", () => {
            DEFAULT_SERVICE_TEMPLATES.forEach((template) => {
                const service = ServiceFromTemplate(template);

                expect(service).toHaveProperty("id");
                expect(service).toHaveProperty("template");
                expect(service.template).toBe(template);
                expect(typeof service.id).toBe("string");
                expect(service.id.length).toBeGreaterThan(0);
            });
        });
    });

    describe("Default Service Templates", () => {
        it("all templates have required properties", () => {
            DEFAULT_SERVICE_TEMPLATES.forEach((template) => {
                expect(template).toHaveProperty("id");
                expect(template).toHaveProperty("name");
                expect(template).toHaveProperty("url");
                expect(template).toHaveProperty("icon");
                expect(template).toHaveProperty("darkMode");
                expect(template).toHaveProperty("tags");

                expect(typeof template.id).toBe("string");
                expect(Array.isArray(template.tags)).toBe(true);
            });
        });

        it("all templates have valid option objects", () => {
            DEFAULT_SERVICE_TEMPLATES.forEach((template) => {
                const optionFields = ["name", "url", "icon", "darkMode"];

                optionFields.forEach((field) => {
                    const option = template[field as keyof typeof template] as {
                        copyOnCreate: boolean;
                        customizable: boolean;
                        default: unknown;
                    };
                    expect(option).toHaveProperty("copyOnCreate");
                    expect(option).toHaveProperty("customizable");
                    expect(option).toHaveProperty("default");

                    expect(typeof option.copyOnCreate).toBe("boolean");
                    expect(typeof option.customizable).toBe("boolean");
                });
            });
        });

        it("all templates have unique IDs", () => {
            const ids = DEFAULT_SERVICE_TEMPLATES.map((t) => t.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it("all templates have valid icon IDs", () => {
            DEFAULT_SERVICE_TEMPLATES.forEach((template) => {
                const iconUrl = IconIdToUrl(template.icon.default);
                expect(iconUrl.length).toBeGreaterThan(0);
            });
        });

        it("all templates have valid URLs", () => {
            DEFAULT_SERVICE_TEMPLATES.forEach((template) => {
                const url = template.url.default;
                expect(typeof url).toBe("string");
                expect(url.length).toBeGreaterThan(0);
            });
        });

        it("all templates have valid names", () => {
            DEFAULT_SERVICE_TEMPLATES.forEach((template) => {
                const name = template.name.default;
                expect(typeof name).toBe("string");
                expect(name.length).toBeGreaterThan(0);
            });
        });

        it("all templates have valid tags", () => {
            DEFAULT_SERVICE_TEMPLATES.forEach((template) => {
                expect(Array.isArray(template.tags)).toBe(true);
                expect(template.tags.length).toBeGreaterThan(0);
                template.tags.forEach((tag) => {
                    expect(typeof tag).toBe("string");
                    expect(tag.length).toBeGreaterThan(0);
                });
            });
        });
    });

    describe("Default Wallpapers", () => {
        it("all wallpapers are valid URLs", () => {
            DEFAULT_WALLPAPERS.forEach((wallpaper) => {
                expect(typeof wallpaper).toBe("string");
                expect(wallpaper.startsWith("https://")).toBe(true);
                expect(wallpaper.length).toBeGreaterThan(0);
            });
        });

        it("all wallpapers are unique", () => {
            const uniqueWallpapers = new Set(DEFAULT_WALLPAPERS);
            expect(uniqueWallpapers.size).toBe(DEFAULT_WALLPAPERS.length);
        });

        it("wallpapers are from unsplash", () => {
            DEFAULT_WALLPAPERS.forEach((wallpaper) => {
                expect(wallpaper).toContain("images.unsplash.com");
            });
        });
    });
});
