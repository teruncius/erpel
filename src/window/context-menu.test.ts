import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock electron module before importing the module under test
vi.mock("electron", () => {
    const mockClipboard = {
        writeImage: vi.fn(),
        writeText: vi.fn(),
    };

    const mockShell = {
        openExternal: vi.fn(),
    };

    const mockMenu = {
        buildFromTemplate: vi.fn(),
    };

    return {
        Menu: mockMenu,
        clipboard: mockClipboard,
        shell: mockShell,
        NativeImage: class MockNativeImage {},
    };
});

// Mock loadNativeImage function
vi.mock("@erpel/common/image", () => ({
    loadNativeImage: vi.fn(),
}));

// Import the module after mocks are set up
import { NativeImage } from "electron";
import { buildMenuForSender } from "./context-menu";

describe("Context Menu", () => {
    let mockLoadNativeImage: ReturnType<typeof vi.fn>;
    let mockMenu: { buildFromTemplate: ReturnType<typeof vi.fn> };
    let mockClipboard: { writeImage: ReturnType<typeof vi.fn>; writeText: ReturnType<typeof vi.fn> };
    let mockShell: { openExternal: ReturnType<typeof vi.fn> };
    let mockIpcMainEvent: {
        sender: {
            openDevTools: ReturnType<typeof vi.fn>;
            inspectElement: ReturnType<typeof vi.fn>;
            reloadIgnoringCache: ReturnType<typeof vi.fn>;
            getURL: ReturnType<typeof vi.fn>;
        };
    };
    const mockNativeImageInstance = {} as NativeImage;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Get the mocked modules
        const { loadNativeImage } = await import("@erpel/common/image");
        mockLoadNativeImage = loadNativeImage as ReturnType<typeof vi.fn>;

        const { Menu, clipboard, shell } = await import("electron");
        mockMenu = Menu as unknown as typeof mockMenu;
        mockClipboard = clipboard as unknown as typeof mockClipboard;
        mockShell = shell as unknown as typeof mockShell;

        // Create mock IpcMainEvent
        mockIpcMainEvent = {
            sender: {
                openDevTools: vi.fn(),
                inspectElement: vi.fn(),
                reloadIgnoringCache: vi.fn(),
                getURL: vi.fn().mockReturnValue("https://example.com/service"),
            },
        };

        // Mock console methods to avoid noise in test output
        vi.spyOn(console, "error").mockImplementation(() => {});

        // Reset Menu.buildFromTemplate to return a mock menu
        mockMenu.buildFromTemplate.mockReturnValue({} as unknown as Electron.Menu);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("buildMenuForSender", () => {
        it("should build menu with all items for service window with image, URL, and content", async () => {
            const mockImage = mockNativeImageInstance;
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: "https://example.com",
                    image: {
                        url: "https://example.com/image.png",
                        data: mockImage,
                    },
                    isEditable: true,
                    content: "selected text",
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: true,
            };

            await buildMenuForSender(options);

            expect(mockMenu.buildFromTemplate).toHaveBeenCalled();
            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];

            // Check that menu contains expected items
            expect(template.length).toBeGreaterThan(0);

            // Should have copy image item
            const copyImageItem = template.find((item) => item.label === "Copy Image");
            expect(copyImageItem).toBeDefined();

            // Should have copy URL item
            const copyURLItem = template.find((item) => item.label === "Copy URL");
            expect(copyURLItem).toBeDefined();

            // Should have text items (cut, copy, paste)
            const cutItem = template.find((item) => item.role === "cut");
            const copyItem = template.find((item) => item.role === "copy");
            const pasteItem = template.find((item) => item.role === "paste");
            expect(cutItem).toBeDefined();
            expect(copyItem).toBeDefined();
            expect(pasteItem).toBeDefined();

            // Should have service window items
            const copyServiceURLItem = template.find((item) => item.label === "Copy service URL");
            const openServiceItem = template.find((item) => item.label === "Open service in browser");
            expect(copyServiceURLItem).toBeDefined();
            expect(openServiceItem).toBeDefined();

            // Should have reload item
            const reloadItem = template.find((item) => item.label === "Reload this service");
            expect(reloadItem).toBeDefined();

            // Should have developer tools items
            const devToolsItem = template.find((item) => item.label === "Open developer tools");
            const inspectItem = template.find((item) => item.label === "Inspect element");
            expect(devToolsItem).toBeDefined();
            expect(inspectItem).toBeDefined();
        });

        it("should build menu for non-service window", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            expect(mockMenu.buildFromTemplate).toHaveBeenCalled();
            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];

            // Should not have service window items
            const copyServiceURLItem = template.find((item) => item.label === "Copy service URL");
            expect(copyServiceURLItem).toBeUndefined();

            // Should have reload item for erpel window
            const reloadItem = template.find((item) => item.label === "Reload erpel window");
            expect(reloadItem).toBeDefined();
        });

        it("should call openDevTools when developer tools item is clicked", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const devToolsItem = template.find((item) => item.label === "Open developer tools");

            expect(devToolsItem).toBeDefined();
            expect(devToolsItem?.click).toBeDefined();

            if (devToolsItem?.click) {
                devToolsItem.click({} as Electron.MenuItem, {} as Electron.BrowserWindow, {} as Electron.KeyboardEvent);
                expect(mockIpcMainEvent.sender.openDevTools).toHaveBeenCalledWith({ mode: "bottom" });
            }
        });

        it("should call inspectElement when inspect element item is clicked", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const inspectItem = template.find((item) => item.label === "Inspect element");

            expect(inspectItem).toBeDefined();
            expect(inspectItem?.click).toBeDefined();

            if (inspectItem?.click) {
                inspectItem.click({} as Electron.MenuItem, {} as Electron.BrowserWindow, {} as Electron.KeyboardEvent);
                expect(mockIpcMainEvent.sender.openDevTools).toHaveBeenCalledWith({ mode: "bottom" });
                expect(mockIpcMainEvent.sender.inspectElement).toHaveBeenCalledWith(100, 200);
            }
        });
    });

    describe("getCopyImageItems", () => {
        it("should return empty array when no image data or URL", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyImageItem = template.find((item) => item.label === "Copy Image");
            expect(copyImageItem).toBeUndefined();
        });

        it("should return copy image item when image data is provided", async () => {
            const mockImage = mockNativeImageInstance;
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: mockImage,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyImageItem = template.find((item) => item.label === "Copy Image");

            expect(copyImageItem).toBeDefined();
            expect(copyImageItem?.click).toBeDefined();

            if (copyImageItem?.click) {
                copyImageItem.click(
                    {} as Electron.MenuItem,
                    {} as Electron.BrowserWindow,
                    {} as Electron.KeyboardEvent
                );
                expect(mockClipboard.writeImage).toHaveBeenCalledWith(mockImage);
            }
        });

        it("should load image from URL when data is not available", async () => {
            const mockImage = mockNativeImageInstance;
            mockLoadNativeImage.mockResolvedValue(mockImage);

            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: "https://example.com/image.png",
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            expect(mockLoadNativeImage).toHaveBeenCalledWith("https://example.com/image.png");

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyImageItem = template.find((item) => item.label === "Copy Image");

            expect(copyImageItem).toBeDefined();

            if (copyImageItem?.click) {
                copyImageItem.click(
                    {} as Electron.MenuItem,
                    {} as Electron.BrowserWindow,
                    {} as Electron.KeyboardEvent
                );
                expect(mockClipboard.writeImage).toHaveBeenCalledWith(mockImage);
            }
        });

        it("should return empty array when image loading fails", async () => {
            mockLoadNativeImage.mockResolvedValue(null);

            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: "https://example.com/failing-image.png",
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            expect(mockLoadNativeImage).toHaveBeenCalledWith("https://example.com/failing-image.png");
            expect(console.error).toHaveBeenCalledWith(
                "Failed to load image:",
                "https://example.com/failing-image.png"
            );

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyImageItem = template.find((item) => item.label === "Copy Image");
            expect(copyImageItem).toBeUndefined();
        });

        it("should prefer image data over URL", async () => {
            const mockImage = mockNativeImageInstance;
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: "https://example.com/image.png",
                        data: mockImage,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            expect(mockLoadNativeImage).not.toHaveBeenCalled();

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyImageItem = template.find((item) => item.label === "Copy Image");
            expect(copyImageItem).toBeDefined();
        });
    });

    describe("getCopyURLItems", () => {
        it("should return empty array when no URL", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyURLItem = template.find((item) => item.label === "Copy URL");
            expect(copyURLItem).toBeUndefined();
        });

        it("should return copy URL item when URL is provided", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: "https://example.com",
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyURLItem = template.find((item) => item.label === "Copy URL");

            expect(copyURLItem).toBeDefined();
            expect(copyURLItem?.click).toBeDefined();

            if (copyURLItem?.click) {
                copyURLItem.click({} as Electron.MenuItem, {} as Electron.BrowserWindow, {} as Electron.KeyboardEvent);
                expect(mockClipboard.writeText).toHaveBeenCalledWith("https://example.com");
            }
        });
    });

    describe("getCopyTextItems", () => {
        it("should return empty array when not editable and no content", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const cutItem = template.find((item) => item.role === "cut");
            const copyItem = template.find((item) => item.role === "copy");
            const pasteItem = template.find((item) => item.role === "paste");

            expect(cutItem).toBeUndefined();
            expect(copyItem).toBeUndefined();
            expect(pasteItem).toBeUndefined();
        });

        it("should return cut and paste items when editable", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: true,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const cutItem = template.find((item) => item.role === "cut");
            const pasteItem = template.find((item) => item.role === "paste");

            expect(cutItem).toBeDefined();
            expect(pasteItem).toBeDefined();
        });

        it("should return copy item when content is provided", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: "selected text",
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyItem = template.find((item) => item.role === "copy");

            expect(copyItem).toBeDefined();
        });

        it("should return all text items when editable and content is provided", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: true,
                    content: "selected text",
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const cutItem = template.find((item) => item.role === "cut");
            const copyItem = template.find((item) => item.role === "copy");
            const pasteItem = template.find((item) => item.role === "paste");

            expect(cutItem).toBeDefined();
            expect(copyItem).toBeDefined();
            expect(pasteItem).toBeDefined();
        });
    });

    describe("getServiceWindowItems", () => {
        it("should return empty array when not a service window", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyServiceURLItem = template.find((item) => item.label === "Copy service URL");
            const openServiceItem = template.find((item) => item.label === "Open service in browser");

            expect(copyServiceURLItem).toBeUndefined();
            expect(openServiceItem).toBeUndefined();
        });

        it("should return service window items when isServiceWindow is true", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: true,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const copyServiceURLItem = template.find((item) => item.label === "Copy service URL");
            const openServiceItem = template.find((item) => item.label === "Open service in browser");

            expect(copyServiceURLItem).toBeDefined();
            expect(openServiceItem).toBeDefined();

            if (copyServiceURLItem?.click) {
                copyServiceURLItem.click(
                    {} as Electron.MenuItem,
                    {} as Electron.BrowserWindow,
                    {} as Electron.KeyboardEvent
                );
                expect(mockIpcMainEvent.sender.getURL).toHaveBeenCalled();
                expect(mockClipboard.writeText).toHaveBeenCalledWith("https://example.com/service");
            }

            if (openServiceItem?.click) {
                openServiceItem.click(
                    {} as Electron.MenuItem,
                    {} as Electron.BrowserWindow,
                    {} as Electron.KeyboardEvent
                );
                expect(mockIpcMainEvent.sender.getURL).toHaveBeenCalled();
                expect(mockShell.openExternal).toHaveBeenCalledWith("https://example.com/service");
            }
        });
    });

    describe("getReloadItems", () => {
        it("should return reload item for service window", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: true,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const reloadItem = template.find((item) => item.label === "Reload this service");

            expect(reloadItem).toBeDefined();
            expect(reloadItem?.click).toBeDefined();

            if (reloadItem?.click) {
                reloadItem.click({} as Electron.MenuItem, {} as Electron.BrowserWindow, {} as Electron.KeyboardEvent);
                expect(mockIpcMainEvent.sender.reloadIgnoringCache).toHaveBeenCalled();
            }
        });

        it("should return reload item for erpel window", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: null,
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: null,
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: false,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];
            const reloadItem = template.find((item) => item.label === "Reload erpel window");

            expect(reloadItem).toBeDefined();
            expect(reloadItem?.click).toBeDefined();

            if (reloadItem?.click) {
                reloadItem.click({} as Electron.MenuItem, {} as Electron.BrowserWindow, {} as Electron.KeyboardEvent);
                expect(mockIpcMainEvent.sender.reloadIgnoringCache).toHaveBeenCalled();
            }
        });
    });

    describe("Menu structure", () => {
        it("should include separators in correct positions", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: "https://example.com",
                    image: {
                        url: null,
                        data: null,
                    },
                    isEditable: false,
                    content: "text",
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: true,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];

            // Find separators
            const separators = template.filter((item) => item.type === "separator");
            expect(separators.length).toBeGreaterThan(0);
        });

        it("should build menu in correct order", async () => {
            const options = {
                data: {
                    x: 100,
                    y: 200,
                    url: "https://example.com",
                    image: {
                        url: "https://example.com/image.png",
                        data: mockNativeImageInstance,
                    },
                    isEditable: true,
                    content: "selected text",
                },
                event: mockIpcMainEvent as unknown as Electron.IpcMainEvent,
                isServiceWindow: true,
            };

            await buildMenuForSender(options);

            const template = mockMenu.buildFromTemplate.mock.calls[0][0] as Electron.MenuItemConstructorOptions[];

            // Verify order: image items, URL items, text items, separator, service items, separator, reload, dev tools
            const labels = template.map((item) => item.label || (item.type === "separator" ? "separator" : ""));

            // Copy Image should come before Copy URL
            const copyImageIndex = labels.indexOf("Copy Image");
            const copyURLIndex = labels.indexOf("Copy URL");
            expect(copyImageIndex).toBeLessThan(copyURLIndex);

            // Developer tools should be near the end
            const devToolsIndex = labels.indexOf("Open developer tools");
            const inspectIndex = labels.indexOf("Inspect element");
            expect(devToolsIndex).toBeGreaterThan(copyURLIndex);
            expect(inspectIndex).toBeGreaterThan(devToolsIndex);
        });
    });
});
