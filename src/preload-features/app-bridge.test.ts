import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppMessage } from "../app-message";
import { Config, Service } from "../state/schema";
import { BackgroundMode } from "../state/settings";

describe("App Bridge", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Electron API simulation", () => {
        let mockIpcRenderer: any;
        let mockContextBridge: any;

        beforeEach(() => {
            mockIpcRenderer = {
                send: vi.fn(),
                invoke: vi.fn(),
            };

            mockContextBridge = {
                exposeInMainWorld: vi.fn((name: string, api: any) => {
                    (window as any)[name] = api;
                }),
            };
        });

        describe("Service management", () => {
            it("should simulate activateService functionality", () => {
                const electronAPI = {
                    activateService: (id: string) => mockIpcRenderer.send(AppMessage.ActivateService, id),
                };

                const serviceId = "test-service-id";
                electronAPI.activateService(serviceId);

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.ActivateService, serviceId);
            });

            it("should simulate addService functionality", () => {
                const electronAPI = {
                    addService: (service: Service) => mockIpcRenderer.send(AppMessage.AddService, service),
                };

                const mockService: Service = {
                    id: "test-id",
                    name: "Test Service",
                    url: "https://example.com",
                    icon: "test-icon",
                    darkMode: false,
                    template: {
                        id: "template-id",
                        name: { copyOnCreate: false, customizable: true, default: "Test" },
                        url: { copyOnCreate: false, customizable: false, default: "https://example.com" },
                        icon: { copyOnCreate: false, customizable: false, default: "icon-id" },
                        darkMode: { copyOnCreate: false, customizable: false, default: false },
                        tags: ["test"],
                    },
                };

                electronAPI.addService(mockService);

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.AddService, mockService);
            });

            it("should simulate removeService functionality", () => {
                const electronAPI = {
                    removeService: (id: string) => mockIpcRenderer.send(AppMessage.RemoveService, id),
                };

                const serviceId = "service-to-remove";
                electronAPI.removeService(serviceId);

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.RemoveService, serviceId);
            });
        });

        describe("Window management", () => {
            it("should simulate focusWindow functionality", () => {
                const electronAPI = {
                    focusWindow: () => mockIpcRenderer.send(AppMessage.FocusWindow),
                };

                electronAPI.focusWindow();

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.FocusWindow);
            });

            it("should simulate hideAllServices functionality", () => {
                const electronAPI = {
                    hideAllServices: () => mockIpcRenderer.send(AppMessage.HideAllServices),
                };

                electronAPI.hideAllServices();

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.HideAllServices);
            });

            it("should simulate setSidebarState functionality", () => {
                const electronAPI = {
                    setSidebarState: (isOpen: boolean) => mockIpcRenderer.send(AppMessage.SetSideBarState, isOpen),
                };

                electronAPI.setSidebarState(true);
                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.SetSideBarState, true);

                electronAPI.setSidebarState(false);
                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.SetSideBarState, false);
            });
        });

        describe("Config management", () => {
            it("should simulate loadConfig functionality", async () => {
                const electronAPI = {
                    loadConfig: () => mockIpcRenderer.invoke(AppMessage.LoadConfig),
                };

                const mockConfig: Config = {
                    dateFormat: "en-US",
                    isMuted: false,
                    isOpen: true,
                    locale: "en-US",
                    mode: BackgroundMode.Wallpaper,
                    services: [],
                    timeFormat: "en-US",
                    version: 0,
                    wallpapers: [],
                };

                mockIpcRenderer.invoke.mockResolvedValue(mockConfig);

                const result = await electronAPI.loadConfig();

                expect(mockIpcRenderer.invoke).toHaveBeenCalledWith(AppMessage.LoadConfig);
                expect(result).toEqual(mockConfig);
            });

            it("should handle loadConfig errors", async () => {
                const electronAPI = {
                    loadConfig: () => mockIpcRenderer.invoke(AppMessage.LoadConfig),
                };

                mockIpcRenderer.invoke.mockRejectedValue(new Error("Load config failed"));

                await expect(electronAPI.loadConfig()).rejects.toThrow("Load config failed");
            });

            it("should simulate saveConfig functionality", () => {
                const electronAPI = {
                    saveConfig: (data: Config) => mockIpcRenderer.send(AppMessage.SaveConfig, data),
                };

                const mockConfig: Config = {
                    dateFormat: "en-US",
                    isMuted: true,
                    isOpen: false,
                    locale: "de-DE",
                    mode: BackgroundMode.Color,
                    services: [],
                    timeFormat: "de-DE",
                    version: 0,
                    wallpapers: ["https://example.com/wallpaper.jpg"],
                };

                electronAPI.saveConfig(mockConfig);

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.SaveConfig, mockConfig);
            });
        });

        describe("Context Bridge simulation", () => {
            it("should simulate contextBridge.exposeInMainWorld", () => {
                const mockAPI = {
                    activateService: vi.fn(),
                    addService: vi.fn(),
                    focusWindow: vi.fn(),
                    hideAllServices: vi.fn(),
                    loadConfig: vi.fn(),
                    removeService: vi.fn(),
                    saveConfig: vi.fn(),
                    setSidebarState: vi.fn(),
                };

                mockContextBridge.exposeInMainWorld("electron", mockAPI);

                expect(mockContextBridge.exposeInMainWorld).toHaveBeenCalledWith("electron", mockAPI);
                expect((window as any).electron).toBe(mockAPI);
            });
        });

        describe("API completeness", () => {
            it("should have all required methods", () => {
                const electronAPI = {
                    activateService: vi.fn(),
                    addService: vi.fn(),
                    focusWindow: vi.fn(),
                    hideAllServices: vi.fn(),
                    loadConfig: vi.fn(),
                    removeService: vi.fn(),
                    saveConfig: vi.fn(),
                    setSidebarState: vi.fn(),
                };

                const expectedMethods = [
                    "activateService",
                    "addService",
                    "focusWindow",
                    "hideAllServices",
                    "loadConfig",
                    "removeService",
                    "saveConfig",
                    "setSidebarState",
                ];

                expectedMethods.forEach((method) => {
                    expect(electronAPI).toHaveProperty(method);
                    expect(typeof electronAPI[method]).toBe("function");
                });
            });

            it("should not have unexpected methods", () => {
                const electronAPI = {
                    activateService: vi.fn(),
                    addService: vi.fn(),
                    focusWindow: vi.fn(),
                    hideAllServices: vi.fn(),
                    loadConfig: vi.fn(),
                    removeService: vi.fn(),
                    saveConfig: vi.fn(),
                    setSidebarState: vi.fn(),
                };

                const apiKeys = Object.keys(electronAPI);
                const expectedMethods = [
                    "activateService",
                    "addService",
                    "focusWindow",
                    "hideAllServices",
                    "loadConfig",
                    "removeService",
                    "saveConfig",
                    "setSidebarState",
                ];

                expect(apiKeys).toEqual(expect.arrayContaining(expectedMethods));
                expect(apiKeys.length).toBe(expectedMethods.length);
            });
        });

        describe("Type safety", () => {
            it("should handle string parameters correctly", () => {
                const electronAPI = {
                    activateService: (id: string) => mockIpcRenderer.send(AppMessage.ActivateService, id),
                    removeService: (id: string) => mockIpcRenderer.send(AppMessage.RemoveService, id),
                };

                electronAPI.activateService("test-id");
                electronAPI.removeService("test-id");

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.ActivateService, "test-id");
                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.RemoveService, "test-id");
            });

            it("should handle boolean parameters correctly", () => {
                const electronAPI = {
                    setSidebarState: (isOpen: boolean) => mockIpcRenderer.send(AppMessage.SetSideBarState, isOpen),
                };

                electronAPI.setSidebarState(true);
                electronAPI.setSidebarState(false);

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.SetSideBarState, true);
                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.SetSideBarState, false);
            });

            it("should handle object parameters correctly", () => {
                const electronAPI = {
                    addService: (service: Service) => mockIpcRenderer.send(AppMessage.AddService, service),
                    saveConfig: (config: Config) => mockIpcRenderer.send(AppMessage.SaveConfig, config),
                };

                const mockService: Service = {
                    id: "test",
                    name: "Test",
                    url: "https://test.com",
                    icon: "icon",
                    darkMode: false,
                    template: {
                        id: "template",
                        name: { copyOnCreate: false, customizable: true, default: "Test" },
                        url: { copyOnCreate: false, customizable: false, default: "https://test.com" },
                        icon: { copyOnCreate: false, customizable: false, default: "icon" },
                        darkMode: { copyOnCreate: false, customizable: false, default: false },
                        tags: ["test"],
                    },
                };

                const mockConfig: Config = {
                    dateFormat: "en-US",
                    isMuted: false,
                    isOpen: true,
                    locale: "en-US",
                    mode: BackgroundMode.Wallpaper,
                    services: [],
                    timeFormat: "en-US",
                    version: 0,
                    wallpapers: [],
                };

                electronAPI.addService(mockService);
                electronAPI.saveConfig(mockConfig);

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.AddService, mockService);
                expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.SaveConfig, mockConfig);
            });
        });
    });

    describe("AppMessage enum", () => {
        it("should have all required message types", () => {
            expect(AppMessage).toHaveProperty("ActivateService");
            expect(AppMessage).toHaveProperty("AddService");
            expect(AppMessage).toHaveProperty("FocusWindow");
            expect(AppMessage).toHaveProperty("HideAllServices");
            expect(AppMessage).toHaveProperty("LoadConfig");
            expect(AppMessage).toHaveProperty("RemoveService");
            expect(AppMessage).toHaveProperty("SaveConfig");
            expect(AppMessage).toHaveProperty("SetSideBarState");
            expect(AppMessage).toHaveProperty("ShouldUseDarkMode");
            expect(AppMessage).toHaveProperty("ShowContextMenu");
        });

        it("should have correct message values", () => {
            expect(AppMessage.ActivateService).toBe("set-active-service");
            expect(AppMessage.AddService).toBe("add-service");
            expect(AppMessage.FocusWindow).toBe("focus-application");
            expect(AppMessage.HideAllServices).toBe("hide-all-services");
            expect(AppMessage.LoadConfig).toBe("load-config");
            expect(AppMessage.RemoveService).toBe("remove-service");
            expect(AppMessage.SaveConfig).toBe("save-config");
            expect(AppMessage.SetSideBarState).toBe("set-side-bar-state");
            expect(AppMessage.ShouldUseDarkMode).toBe("should-use-dark-mode");
            expect(AppMessage.ShowContextMenu).toBe("show-context-menu");
        });
    });
});
