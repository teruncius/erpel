import { beforeEach, describe, expect, it } from "vitest";
import { create } from "zustand";

import { createSettingsSlice, SettingsStoreActions, SettingsStoreState } from "./settings-store";
import { BackgroundMode, DEFAULT_IS_MUTED, DEFAULT_LOCALE } from "../../state/settings";

// Create a test store
const useTestStore = create<SettingsStoreActions & SettingsStoreState>()((...args) => ({
    ...createSettingsSlice(...args),
}));

describe("SettingsStore", () => {
    beforeEach(() => {
        useTestStore.setState(useTestStore.getInitialState());
    });

    describe("Initial State", () => {
        it("has correct default values", () => {
            const state = useTestStore.getState();

            expect(state.dateFormat).toBe(DEFAULT_LOCALE);
            expect(state.isMuted).toBe(DEFAULT_IS_MUTED);
            expect(state.locale).toBe(DEFAULT_LOCALE);
            expect(state.mode).toBe(BackgroundMode.Wallpaper);
            expect(state.timeFormat).toBe(DEFAULT_LOCALE);
            expect(state.wallpapers).toEqual([]);
        });

        it("locale is set to default", () => {
            expect(useTestStore.getState().locale).toEqual("en-US");
        });
    });

    describe("Settings Management", () => {
        it("sets date format", () => {
            useTestStore.getState().setDateFormat("de-DE");

            expect(useTestStore.getState().dateFormat).toBe("de-DE");
        });

        it("sets is muted", () => {
            useTestStore.getState().setIsMuted(true);

            expect(useTestStore.getState().isMuted).toBe(true);
        });

        it("sets locale", () => {
            useTestStore.getState().setLocale("fr-FR");

            expect(useTestStore.getState().locale).toBe("fr-FR");
        });

        it("sets background mode", () => {
            useTestStore.getState().setMode(BackgroundMode.Color);

            expect(useTestStore.getState().mode).toBe(BackgroundMode.Color);
        });

        it("sets time format", () => {
            useTestStore.getState().setTimeFormat("ja-JP");

            expect(useTestStore.getState().timeFormat).toBe("ja-JP");
        });

        it("sets wallpapers", () => {
            const wallpapers = [
                "https://example.com/wallpaper1.jpg",
                "https://example.com/wallpaper2.jpg",
            ];

            useTestStore.getState().setWallpapers(wallpapers);

            expect(useTestStore.getState().wallpapers).toEqual(wallpapers);
        });

        it("sets empty wallpapers array", () => {
            useTestStore.getState().setWallpapers([]);

            expect(useTestStore.getState().wallpapers).toEqual([]);
        });
    });

    describe("Load Settings from File", () => {
        it("loads all settings from file", () => {
            const fileSettings: SettingsStoreState = {
                dateFormat: "es-ES",
                isMuted: true,
                locale: "es-ES",
                mode: BackgroundMode.Color,
                timeFormat: "es-ES",
                wallpapers: ["https://example.com/spanish-wallpaper.jpg"],
            };

            useTestStore.getState().loadSettingsFromFile(fileSettings);

            const state = useTestStore.getState();
            expect(state.dateFormat).toBe("es-ES");
            expect(state.isMuted).toBe(true);
            expect(state.locale).toBe("es-ES");
            expect(state.mode).toBe(BackgroundMode.Color);
            expect(state.timeFormat).toBe("es-ES");
            expect(state.wallpapers).toEqual(["https://example.com/spanish-wallpaper.jpg"]);
        });

        it("overwrites existing settings when loading from file", () => {
            // Set some initial settings
            useTestStore.getState().setLocale("en-US");
            useTestStore.getState().setIsMuted(false);
            useTestStore.getState().setMode(BackgroundMode.Wallpaper);

            const fileSettings: SettingsStoreState = {
                dateFormat: "zh-CN",
                isMuted: true,
                locale: "zh-CN",
                mode: BackgroundMode.Color,
                timeFormat: "zh-CN",
                wallpapers: ["https://example.com/chinese-wallpaper.jpg"],
            };

            useTestStore.getState().loadSettingsFromFile(fileSettings);

            const state = useTestStore.getState();
            expect(state.locale).toBe("zh-CN");
            expect(state.isMuted).toBe(true);
            expect(state.mode).toBe(BackgroundMode.Color);
        });

        it("handles partial settings from file", () => {
            const partialSettings: SettingsStoreState = {
                dateFormat: "it-IT",
                isMuted: false,
                locale: "it-IT",
                mode: BackgroundMode.Wallpaper,
                timeFormat: "it-IT",
                wallpapers: [],
            };

            useTestStore.getState().loadSettingsFromFile(partialSettings);

            const state = useTestStore.getState();
            expect(state.dateFormat).toBe("it-IT");
            expect(state.isMuted).toBe(false);
            expect(state.locale).toBe("it-IT");
            expect(state.mode).toBe(BackgroundMode.Wallpaper);
            expect(state.timeFormat).toBe("it-IT");
            expect(state.wallpapers).toEqual([]);
        });
    });

    describe("Background Mode", () => {
        it("sets wallpaper mode", () => {
            useTestStore.getState().setMode(BackgroundMode.Wallpaper);

            expect(useTestStore.getState().mode).toBe(BackgroundMode.Wallpaper);
        });

        it("sets color mode", () => {
            useTestStore.getState().setMode(BackgroundMode.Color);

            expect(useTestStore.getState().mode).toBe(BackgroundMode.Color);
        });

        it("cycles through different modes", () => {
            useTestStore.getState().setMode(BackgroundMode.Wallpaper);
            expect(useTestStore.getState().mode).toBe(BackgroundMode.Wallpaper);

            useTestStore.getState().setMode(BackgroundMode.Color);
            expect(useTestStore.getState().mode).toBe(BackgroundMode.Color);

            useTestStore.getState().setMode(BackgroundMode.Wallpaper);
            expect(useTestStore.getState().mode).toBe(BackgroundMode.Wallpaper);
        });
    });

    describe("Locale and Format Settings", () => {
        it("sets different locales", () => {
            const locales = ["en-US", "de-DE", "fr-FR", "ja-JP", "zh-CN"];

            locales.forEach((locale) => {
                useTestStore.getState().setLocale(locale);
                expect(useTestStore.getState().locale).toBe(locale);
            });
        });

        it("sets different date formats", () => {
            const dateFormats = ["en-US", "de-DE", "fr-FR", "ja-JP"];

            dateFormats.forEach((format) => {
                useTestStore.getState().setDateFormat(format);
                expect(useTestStore.getState().dateFormat).toBe(format);
            });
        });

        it("sets different time formats", () => {
            const timeFormats = ["en-US", "de-DE", "fr-FR", "ja-JP"];

            timeFormats.forEach((format) => {
                useTestStore.getState().setTimeFormat(format);
                expect(useTestStore.getState().timeFormat).toBe(format);
            });
        });

        it("allows different formats for date and time", () => {
            useTestStore.getState().setDateFormat("de-DE");
            useTestStore.getState().setTimeFormat("en-US");

            const state = useTestStore.getState();
            expect(state.dateFormat).toBe("de-DE");
            expect(state.timeFormat).toBe("en-US");
        });
    });

    describe("Wallpaper Management", () => {
        it("sets single wallpaper", () => {
            const wallpaper = "https://example.com/single-wallpaper.jpg";

            useTestStore.getState().setWallpapers([wallpaper]);

            expect(useTestStore.getState().wallpapers).toEqual([wallpaper]);
        });

        it("sets multiple wallpapers", () => {
            const wallpapers = [
                "https://example.com/wallpaper1.jpg",
                "https://example.com/wallpaper2.jpg",
                "https://example.com/wallpaper3.jpg",
            ];

            useTestStore.getState().setWallpapers(wallpapers);

            expect(useTestStore.getState().wallpapers).toEqual(wallpapers);
        });

        it("replaces existing wallpapers", () => {
            const initialWallpapers = ["https://example.com/initial.jpg"];
            const newWallpapers = ["https://example.com/new1.jpg", "https://example.com/new2.jpg"];

            useTestStore.getState().setWallpapers(initialWallpapers);
            useTestStore.getState().setWallpapers(newWallpapers);

            expect(useTestStore.getState().wallpapers).toEqual(newWallpapers);
        });

        it("clears wallpapers", () => {
            const wallpapers = ["https://example.com/wallpaper1.jpg"];

            useTestStore.getState().setWallpapers(wallpapers);
            useTestStore.getState().setWallpapers([]);

            expect(useTestStore.getState().wallpapers).toEqual([]);
        });
    });

    describe("Mute Settings", () => {
        it("toggles mute state", () => {
            expect(useTestStore.getState().isMuted).toBe(DEFAULT_IS_MUTED);

            useTestStore.getState().setIsMuted(true);
            expect(useTestStore.getState().isMuted).toBe(true);

            useTestStore.getState().setIsMuted(false);
            expect(useTestStore.getState().isMuted).toBe(false);
        });

        it("maintains mute state across other setting changes", () => {
            useTestStore.getState().setIsMuted(true);
            useTestStore.getState().setLocale("de-DE");
            useTestStore.getState().setMode(BackgroundMode.Color);

            expect(useTestStore.getState().isMuted).toBe(true);
        });
    });

    describe("State Consistency", () => {
        it("maintains state consistency across multiple operations", () => {
            useTestStore.getState().setLocale("de-DE");
            useTestStore.getState().setDateFormat("de-DE");
            useTestStore.getState().setTimeFormat("de-DE");
            useTestStore.getState().setIsMuted(true);
            useTestStore.getState().setMode(BackgroundMode.Color);
            useTestStore.getState().setWallpapers(["https://example.com/german-wallpaper.jpg"]);

            const state = useTestStore.getState();
            expect(state.locale).toBe("de-DE");
            expect(state.dateFormat).toBe("de-DE");
            expect(state.timeFormat).toBe("de-DE");
            expect(state.isMuted).toBe(true);
            expect(state.mode).toBe(BackgroundMode.Color);
            expect(state.wallpapers).toEqual(["https://example.com/german-wallpaper.jpg"]);
        });

        it("handles rapid setting changes", () => {
            const locales = ["en-US", "de-DE", "fr-FR", "ja-JP"];
            const modes = [BackgroundMode.Wallpaper, BackgroundMode.Color];

            locales.forEach((locale) => {
                useTestStore.getState().setLocale(locale);
            });

            modes.forEach((mode) => {
                useTestStore.getState().setMode(mode);
            });

            const state = useTestStore.getState();
            expect(state.locale).toBe("ja-JP");
            expect(state.mode).toBe(BackgroundMode.Color);
        });
    });

    describe("Edge Cases", () => {
        it("handles empty string values", () => {
            useTestStore.getState().setLocale("");
            useTestStore.getState().setDateFormat("");
            useTestStore.getState().setTimeFormat("");

            const state = useTestStore.getState();
            expect(state.locale).toBe("");
            expect(state.dateFormat).toBe("");
            expect(state.timeFormat).toBe("");
        });

        it("handles invalid wallpaper URLs", () => {
            const invalidWallpapers = ["invalid-url", "", "not-a-url"];

            useTestStore.getState().setWallpapers(invalidWallpapers);

            expect(useTestStore.getState().wallpapers).toEqual(invalidWallpapers);
        });

        it("handles very long wallpaper arrays", () => {
            const manyWallpapers = Array.from({ length: 100 }, (_, i) => 
                `https://example.com/wallpaper${i}.jpg`
            );

            useTestStore.getState().setWallpapers(manyWallpapers);

            expect(useTestStore.getState().wallpapers).toEqual(manyWallpapers);
        });
    });
});
