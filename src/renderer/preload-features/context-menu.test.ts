import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AppMessage } from "@erpel/app-message";

// Mock electron module before importing the module under test
vi.mock("electron", () => ({
    ipcRenderer: {
        send: vi.fn(),
    },
}));

describe("Context Menu", () => {
    let mockIpcRenderer: { send: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        vi.clearAllMocks();

        // Get the mocked ipcRenderer
        const { ipcRenderer } = await import("electron");
        mockIpcRenderer = ipcRenderer as unknown as { send: ReturnType<typeof vi.fn> };

        // Mock window.fetch for image fetching tests
        window.fetch = vi.fn();

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
                }),
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
                }),
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
                }),
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
                }),
            );

            document.body.removeChild(div);
        });
    });

    describe("getImageBase64 function behavior", () => {
        it("should return null for elements without image src", async () => {
            const div = document.createElement("div");
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
                    image: null,
                }),
            );

            document.body.removeChild(div);
        });

        it("should return data URL as-is for images with data URLs", async () => {
            const img = document.createElement("img");
            img.src = "data:image/png;base64,test123";
            document.body.appendChild(img);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: img, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: "data:image/png;base64,test123",
                }),
            );

            document.body.removeChild(img);
        });

        it("should fetch and convert HTTP URLs to base64", async () => {
            const img = document.createElement("img");
            img.src = "http://example.com/image.png";
            document.body.appendChild(img);

            const mockBlob = new Blob(["image data"], { type: "image/png" });
            (window.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: img, writable: false });

            window.dispatchEvent(event);

            // Wait for fetch and FileReader operations
            await new Promise((resolve) => setTimeout(resolve, 100));

            expect(window.fetch).toHaveBeenCalledWith("http://example.com/image.png");
            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: expect.stringMatching(/^data:image\/png;base64,/),
                }),
            );

            document.body.removeChild(img);
        });

        it("should return null on fetch error", async () => {
            const img = document.createElement("img");
            img.src = "http://example.com/failing-image.png";
            document.body.appendChild(img);

            (window.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Network error"));

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
                    image: null,
                }),
            );

            document.body.removeChild(img);
        });

        it("should return null for invalid image paths", async () => {
            const img = document.createElement("img");
            img.src = "invalid://path/to/image.png";
            document.body.appendChild(img);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: img, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    image: null,
                }),
            );

            document.body.removeChild(img);
        });
    });

    describe("Context menu event handler", () => {
        it("should prevent default and send IPC message with correct data for div", async () => {
            const div = document.createElement("div");
            div.textContent = "Hello World";
            document.body.appendChild(div);

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
                image: null,
                content: "Hello World",
            });

            document.body.removeChild(div);
        });

        it("should extract href from anchor element", async () => {
            const anchor = document.createElement("a");
            anchor.href = "https://example.com";
            anchor.textContent = "Click me";
            document.body.appendChild(anchor);

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
                    content: "Click me",
                }),
            );

            document.body.removeChild(anchor);
        });

        it("should handle elements with empty textContent", async () => {
            const div = document.createElement("div");
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
                    content: null, // Empty string || null = null
                }),
            );

            document.body.removeChild(div);
        });

        it("should handle nested elements correctly", async () => {
            const div = document.createElement("div");
            const span = document.createElement("span");
            span.textContent = "nested text";
            div.appendChild(span);
            document.body.appendChild(div);

            const event = new PointerEvent("contextmenu", {
                clientX: 100,
                clientY: 200,
                bubbles: true,
            });
            Object.defineProperty(event, "target", { value: span, writable: false });

            window.dispatchEvent(event);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockIpcRenderer.send).toHaveBeenCalledWith(
                AppMessage.ShowContextMenu,
                expect.objectContaining({
                    content: "nested text",
                }),
            );

            document.body.removeChild(div);
        });

        it("should handle coordinates at various positions", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

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
                    }),
                );
            }

            document.body.removeChild(div);
        });

        it("should call preventDefault before sending IPC message", async () => {
            const div = document.createElement("div");
            document.body.appendChild(div);

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
                }),
            );

            document.body.removeChild(div);
        });

        it("should handle elements without src attribute", async () => {
            const div = document.createElement("div");
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
                    image: null,
                }),
            );

            document.body.removeChild(div);
        });
    });
});
