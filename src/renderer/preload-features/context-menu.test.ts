import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppMessage } from "@erpel/app-message";

// Mock electron module before importing the module under test
const mockNativeImage = {
    createFromBuffer: vi.fn(),
    createFromDataURL: vi.fn(),
};

vi.mock("electron", () => ({
    ipcRenderer: {
        send: vi.fn(),
    },
    nativeImage: mockNativeImage,
    NativeImage: class MockNativeImage {},
}));

// Mock loadNativeImage function
vi.mock("@erpel/common/image", () => ({
    loadNativeImage: vi.fn(),
}));

describe("Context Menu", () => {
    let mockIpcRenderer: { send: ReturnType<typeof vi.fn> };
    let mockLoadNativeImage: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Get the mocked ipcRenderer
        const { ipcRenderer } = await import("electron");
        mockIpcRenderer = ipcRenderer as unknown as { send: ReturnType<typeof vi.fn> };

        // Get the mocked loadNativeImage
        const { loadNativeImage } = await import("@erpel/common/image");
        mockLoadNativeImage = loadNativeImage as ReturnType<typeof vi.fn>;

        // Mock window.fetch for image fetching tests
        window.fetch = vi.fn();

        // Mock document.getSelection
        document.getSelection = vi.fn().mockReturnValue({
            toString: () => "",
        });

        // Import the module to set up the event listener
        await import("../preload-features/context-menu");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("getIsEditable function behavior", () => {
        it("should detect INPUT elements as editable", async () => {
            const input = document.createElement("input");
            input.value = "test";
            document.body.appendChild(input);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: input, writable: false });

            window.dispatchEvent(event);

            // Wait for async operations
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    isEditable: true,
                })
            );

            document.body.removeChild(input);
        });

        it("should detect TEXTAREA elements as editable", async () => {
            const textarea = document.createElement("textarea");
            textarea.textContent = "test";
            document.body.appendChild(textarea);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: textarea, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    isEditable: true,
                })
            );

            document.body.removeChild(textarea);
        });

        it("should detect contentEditable elements as editable", async () => {
            const div = document.createElement("div");
            div.contentEditable = "true";
            div.textContent = "editable";
            document.body.appendChild(div);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    isEditable: true,
                })
            );

            document.body.removeChild(div);
        });

        it("should detect regular div elements as not editable", async () => {
            const div = document.createElement("div");
            div.textContent = "not editable";
            document.body.appendChild(div);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    isEditable: false,
                })
            );

            document.body.removeChild(div);
        });
    });

    describe("getImageData function behavior", () => {
        it("should return null for elements without image src", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: expect.objectContaining({
                        url: null,
                        data: null,
                    }),
                })
            );

            document.body.removeChild(div);
        });

        it("should return image data for images with data URLs", async () => {
            const img = document.createElement("img");
            img.src = "data:image/png;base64,test123";
            document.body.appendChild(img);

            const mockNativeImageInstance = {};
            mockLoadNativeImage.mockResolvedValue(mockNativeImageInstance);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: img, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockLoadNativeImage).toHaveBeenCalledWith("data:image/png;base64,test123");
            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: expect.objectContaining({
                        url: "data:image/png;base64,test123",
                        data: mockNativeImageInstance,
                    }),
                })
            );

            document.body.removeChild(img);
        });

        it("should fetch and convert HTTP URLs to NativeImage", async () => {
            const img = document.createElement("img");
            img.src = "http://example.com/image.png";
            document.body.appendChild(img);

            const mockBlob = new Blob(["image data"], { type: "image/png" });
            (window.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            const mockNativeImageInstance = {};
            mockLoadNativeImage.mockResolvedValue(mockNativeImageInstance);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: img, writable: false });

            window.dispatchEvent(event);

            // Wait for async operations
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(mockLoadNativeImage).toHaveBeenCalledWith("http://example.com/image.png");
            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: expect.objectContaining({
                        url: "http://example.com/image.png",
                        data: mockNativeImageInstance,
                    }),
                })
            );

            document.body.removeChild(img);
        });

        it("should return null data on loadNativeImage error", async () => {
            const img = document.createElement("img");
            img.src = "http://example.com/failing-image.png";
            document.body.appendChild(img);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: img, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: expect.objectContaining({
                        url: "http://example.com/failing-image.png",
                        data: null,
                    }),
                })
            );

            document.body.removeChild(img);
        });

        it("should return null data for invalid image paths", async () => {
            const img = document.createElement("img");
            img.src = "invalid://path/to/image.png";
            document.body.appendChild(img);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: img, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockLoadNativeImage).toHaveBeenCalledWith("invalid://path/to/image.png");
            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: expect.objectContaining({
                        url: "invalid://path/to/image.png",
                        data: null,
                    }),
                })
            );

            document.body.removeChild(img);
        });
    });

    describe("Context menu event handler", () => {
        it("should prevent default and send IPC message with correct data for div", async () => {
            const div = document.createElement("div");
            div.textContent = "Hello World";
            document.body.appendChild(div);

            const mockSelection = {
                toString: vi.fn().mockReturnValue("selected text"),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            const preventDefaultSpy = vi.spyOn(event, "preventDefault");

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(mockIpcRenderer.send).toHaveBeenCalledWith(AppMessage.ShowContextMenu, {
                x: 100,
                y: 200,
                isEditable: false,
                url: null,
                image: expect.objectContaining({
                    url: null,
                    data: null,
                }),
                content: "selected text",
            });

            document.body.removeChild(div);
        });

        it("should extract href from anchor element", async () => {
            const anchor = document.createElement("a");
            anchor.href = "https://example.com";
            anchor.textContent = "Click me";
            document.body.appendChild(anchor);

            const mockSelection = {
                toString: vi.fn().mockReturnValue(""),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 200,
                clientY: 300,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: anchor, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    url: expect.stringContaining("example.com"),
                    content: null, // Empty string || null = null
                })
            );

            document.body.removeChild(anchor);
        });

        it("should handle elements with no selection", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            document.getSelection = vi.fn().mockReturnValue(null);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    content: null, // null selection || null = null
                })
            );

            document.body.removeChild(div);
        });

        it("should handle empty selection", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const mockSelection = {
                toString: vi.fn().mockReturnValue(""),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    content: null, // Empty string || null = null
                })
            );

            document.body.removeChild(div);
        });

        it("should handle selected text", async () => {
            const div = document.createElement("div");
            div.textContent = "Some text";
            document.body.appendChild(div);

            const mockSelection = {
                toString: vi.fn().mockReturnValue("selected text"),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    content: "selected text",
                })
            );

            document.body.removeChild(div);
        });

        it("should handle coordinates at various positions", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const mockSelection = {
                toString: vi.fn().mockReturnValue(""),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const coordinates = [
                { x: 0, y: 0 },
                { x: 100, y: 200 },
                { x: 1920, y: 1080 },
                { x: -10, y: -20 },
                { x: 123, y: 678 },
            ];

            for (const coord of coordinates) {
                vi.clearAllMocks();
                const event = new PointerEvent("contextmenu", {
                    clientX: coord.x,
                    clientY: coord.y,
                    bubbles: true,
                });
                Object.defineProperty(event, "target", { value: div, writable: false });

                window.dispatchEvent(event);

                await new Promise((resolve) => setTimeout(resolve, 0));

                expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                    AppMessage.ShowContextMenu,
                    expect.objectContaining({
                        x: coord.x,
                        y: coord.y,
                    })
                );
            }

            document.body.removeChild(div);
        });

        it("should call preventDefault before sending IPC message", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const mockSelection = {
                toString: vi.fn().mockReturnValue(""),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            const preventDefaultSpy = vi.spyOn(event, "preventDefault");
            const callOrder: string[] = [];
            preventDefaultSpy.mockImplementation(() => {
                callOrder.push("preventDefault");
            });
            mockIpcRenderer.send.mockImplementation(() => {
                callOrder.push("ipcSend");
            });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(callOrder).toEqual(["preventDefault", "ipcSend"]);

            document.body.removeChild(div);
        });
    });

    describe("Edge cases and error handling", () => {
        it("should handle elements without href attribute", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const mockSelection = {
                toString: vi.fn().mockReturnValue(""),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    url: null,
                })
            );

            document.body.removeChild(div);
        });

        it("should handle elements without src attribute", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

            const mockSelection = {
                toString: vi.fn().mockReturnValue(""),
            };
            document.getSelection = vi.fn().mockReturnValue(mockSelection);

            mockLoadNativeImage.mockResolvedValue(null);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: div, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: expect.objectContaining({
                        url: null,
                        data: null,
                    }),
                })
            );

            document.body.removeChild(div);
        });
    });
});
