import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock electron module before importing the module under test
vi.mock("electron", () => {
    const mockNativeImageInstance = {};
    const mockNativeImage = {
        createFromBuffer: vi.fn().mockReturnValue(mockNativeImageInstance),
        createFromDataURL: vi.fn().mockReturnValue(mockNativeImageInstance),
    };
    return {
        nativeImage: mockNativeImage,
        NativeImage: class MockNativeImage {},
    };
});

// Import the module after mocks are set up
import { loadNativeImage } from "./image";

describe("loadNativeImage", () => {
    let mockNativeImage: { createFromBuffer: ReturnType<typeof vi.fn>; createFromDataURL: ReturnType<typeof vi.fn> };
    let mockNativeImageInstance: unknown;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Get the mocked nativeImage
        const { nativeImage } = await import("electron");
        mockNativeImage = nativeImage as unknown as typeof mockNativeImage;

        // Create a fresh instance object
        mockNativeImageInstance = {};

        // Reset mocks to return the instance
        mockNativeImage.createFromBuffer.mockReturnValue(mockNativeImageInstance);
        mockNativeImage.createFromDataURL.mockReturnValue(mockNativeImageInstance);

        // Mock fetch (works in both Node.js and browser environments)
        if (typeof global !== "undefined") {
            global.fetch = vi.fn();
        }
        if (typeof window !== "undefined") {
            window.fetch = vi.fn();
        }

        // Mock Buffer in browser environment if not available
        if (typeof Buffer === "undefined" && typeof globalThis !== "undefined") {
            (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = {
                from: vi.fn((data: ArrayBuffer) => {
                    return new Uint8Array(data) as unknown as Buffer;
                }),
            } as unknown as typeof Buffer;
        }

        // Mock console methods to avoid noise in test output
        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("null handling", () => {
        it("should return null for null imagePath", async () => {
            const result = await loadNativeImage(null);

            expect(result).toBeNull();
            expect(mockNativeImage.createFromBuffer).not.toHaveBeenCalled();
            expect(mockNativeImage.createFromDataURL).not.toHaveBeenCalled();
        });
    });

    describe("HTTP/HTTPS URLs", () => {
        it("should fetch HTTP URL and create NativeImage from buffer", async () => {
            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const mockArrayBuffer = new ArrayBuffer(8);
            const mockBuffer =
                typeof Buffer !== "undefined"
                    ? Buffer.from(mockArrayBuffer)
                    : (new Uint8Array(mockArrayBuffer) as unknown as Buffer);

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            // Mock blob.arrayBuffer()
            vi.spyOn(mockBlob, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            const result = await loadNativeImage("http://example.com/image.png");

            expect(fetchMock).toHaveBeenCalledWith("http://example.com/image.png", {
                credentials: "include",
            });
            expect(mockNativeImage.createFromBuffer).toHaveBeenCalledWith(mockBuffer);
            expect(result).toBe(mockNativeImageInstance);
            expect(console.log).toHaveBeenCalledWith("Image path is a URL:", "http://example.com/image.png");
        });

        it("should fetch HTTPS URL and create NativeImage from buffer", async () => {
            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const mockArrayBuffer = new ArrayBuffer(8);
            const mockBuffer =
                typeof Buffer !== "undefined"
                    ? Buffer.from(mockArrayBuffer)
                    : (new Uint8Array(mockArrayBuffer) as unknown as Buffer);

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            vi.spyOn(mockBlob, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            const result = await loadNativeImage("https://example.com/image.png");

            expect(fetchMock).toHaveBeenCalledWith("https://example.com/image.png", {
                credentials: "include",
            });
            expect(mockNativeImage.createFromBuffer).toHaveBeenCalledWith(mockBuffer);
            expect(result).toBe(mockNativeImageInstance);
            expect(console.log).toHaveBeenCalledWith("Image path is a URL:", "https://example.com/image.png");
        });

        it("should return null on fetch error", async () => {
            const fetchError = new Error("Network error");
            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockRejectedValue(fetchError);

            const result = await loadNativeImage("http://example.com/failing-image.png");

            expect(fetchMock).toHaveBeenCalledWith("http://example.com/failing-image.png", {
                credentials: "include",
            });
            expect(mockNativeImage.createFromBuffer).not.toHaveBeenCalled();
            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith("Error fetching image:", fetchError);
        });

        it("should return null on blob conversion error", async () => {
            const blobError = new Error("Blob conversion failed");
            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.reject(blobError),
            });

            const result = await loadNativeImage("http://example.com/image.png");

            expect(fetchMock).toHaveBeenCalled();
            expect(mockNativeImage.createFromBuffer).not.toHaveBeenCalled();
            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith("Error fetching image:", blobError);
        });

        it("should handle different image formats", async () => {
            const formats = [
                "http://example.com/image.jpg",
                "http://example.com/image.jpeg",
                "http://example.com/image.gif",
                "http://example.com/image.webp",
                "http://example.com/image.svg",
            ];

            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const mockArrayBuffer = new ArrayBuffer(8);

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            vi.spyOn(mockBlob, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            for (const url of formats) {
                vi.clearAllMocks();
                await loadNativeImage(url);

                expect(fetchMock).toHaveBeenCalledWith(url, {
                    credentials: "include",
                });
                // In browser, Buffer might not be available, so createFromBuffer might not be called
                // But the function should still handle the URL correctly
                if (typeof Buffer !== "undefined") {
                    expect(mockNativeImage.createFromBuffer).toHaveBeenCalled();
                }
            }
        });
    });

    describe("Data URLs", () => {
        it("should create NativeImage from data URL", async () => {
            const dataUrl =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

            const result = await loadNativeImage(dataUrl);

            expect(mockNativeImage.createFromDataURL).toHaveBeenCalledWith(dataUrl);
            expect(mockNativeImage.createFromBuffer).not.toHaveBeenCalled();
            const fetchMock = typeof global !== "undefined" ? global.fetch : window.fetch;
            expect(fetchMock).not.toHaveBeenCalled();
            expect(result).toBe(mockNativeImageInstance);
            expect(console.log).toHaveBeenCalledWith("Image path is a data URL:", dataUrl);
        });

        it("should handle different data URL formats", async () => {
            const dataUrls = [
                "data:image/png;base64,test",
                "data:image/jpeg;base64,test",
                "data:image/gif;base64,test",
                "data:image/svg+xml;base64,test",
            ];

            for (const dataUrl of dataUrls) {
                vi.clearAllMocks();
                await loadNativeImage(dataUrl);

                expect(mockNativeImage.createFromDataURL).toHaveBeenCalledWith(dataUrl);
                expect(console.log).toHaveBeenCalledWith("Image path is a data URL:", dataUrl);
            }
        });
    });

    describe("Invalid paths", () => {
        it("should return null for invalid image paths", async () => {
            const invalidPaths = [
                "invalid://path/to/image.png",
                "file:///path/to/image.png",
                "ftp://example.com/image.png",
                "relative/path/image.png",
                "just-a-string",
                "",
            ];

            for (const path of invalidPaths) {
                vi.clearAllMocks();
                const result = await loadNativeImage(path);

                expect(result).toBeNull();
                expect(mockNativeImage.createFromBuffer).not.toHaveBeenCalled();
                expect(mockNativeImage.createFromDataURL).not.toHaveBeenCalled();
                const fetchMock = typeof global !== "undefined" ? global.fetch : window.fetch;
                expect(fetchMock).not.toHaveBeenCalled();
                expect(console.error).toHaveBeenCalledWith("Invalid image path:", path);
            }
        });

        it("should return null for paths that don't start with http or data", async () => {
            const result = await loadNativeImage("not-a-valid-path");

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith("Invalid image path:", "not-a-valid-path");
        });
    });

    describe("Edge cases", () => {
        it("should handle URLs with query parameters", async () => {
            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const mockArrayBuffer = new ArrayBuffer(8);
            const mockBuffer =
                typeof Buffer !== "undefined"
                    ? Buffer.from(mockArrayBuffer)
                    : (new Uint8Array(mockArrayBuffer) as unknown as Buffer);

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            vi.spyOn(mockBlob, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            const url = "https://example.com/image.png?size=large&format=png";
            const result = await loadNativeImage(url);

            expect(fetchMock).toHaveBeenCalledWith(url, {
                credentials: "include",
            });
            expect(mockNativeImage.createFromBuffer).toHaveBeenCalledWith(mockBuffer);
            expect(result).toBe(mockNativeImageInstance);
        });

        it("should handle URLs with fragments", async () => {
            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const mockArrayBuffer = new ArrayBuffer(8);
            const mockBuffer =
                typeof Buffer !== "undefined"
                    ? Buffer.from(mockArrayBuffer)
                    : (new Uint8Array(mockArrayBuffer) as unknown as Buffer);

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            vi.spyOn(mockBlob, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            const url = "http://example.com/image.png#section";
            const result = await loadNativeImage(url);

            expect(fetchMock).toHaveBeenCalledWith(url, {
                credentials: "include",
            });
            expect(mockNativeImage.createFromBuffer).toHaveBeenCalledWith(mockBuffer);
            expect(result).toBe(mockNativeImageInstance);
        });

        it("should handle empty data URL", async () => {
            const emptyDataUrl = "data:image/png;base64,";
            const result = await loadNativeImage(emptyDataUrl);

            expect(mockNativeImage.createFromDataURL).toHaveBeenCalledWith(emptyDataUrl);
            expect(result).toBe(mockNativeImageInstance);
        });

        it("should handle very long URLs", async () => {
            const longUrl = "http://example.com/" + "a".repeat(1000) + ".png";
            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const mockArrayBuffer = new ArrayBuffer(8);
            const mockBuffer =
                typeof Buffer !== "undefined"
                    ? Buffer.from(mockArrayBuffer)
                    : (new Uint8Array(mockArrayBuffer) as unknown as Buffer);

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            vi.spyOn(mockBlob, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            const result = await loadNativeImage(longUrl);

            expect(fetchMock).toHaveBeenCalledWith(longUrl, {
                credentials: "include",
            });
            expect(mockNativeImage.createFromBuffer).toHaveBeenCalledWith(mockBuffer);
            expect(result).toBe(mockNativeImageInstance);
        });
    });

    describe("Error handling", () => {
        it("should handle arrayBuffer conversion error", async () => {
            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const arrayBufferError = new Error("ArrayBuffer conversion failed");

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            vi.spyOn(mockBlob, "arrayBuffer").mockRejectedValue(arrayBufferError);

            const result = await loadNativeImage("http://example.com/image.png");

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith("Error fetching image:", arrayBufferError);
        });

        it("should handle Buffer creation error", async () => {
            // Skip this test in browser environment as Buffer is not available
            if (typeof Buffer === "undefined") {
                return;
            }

            const mockBlob = new Blob(["image data"], { type: "image/png" });
            const mockArrayBuffer = new ArrayBuffer(8);

            const fetchMock = (typeof global !== "undefined" ? global.fetch : window.fetch) as ReturnType<typeof vi.fn>;
            fetchMock.mockResolvedValue({
                blob: () => Promise.resolve(mockBlob),
            });

            vi.spyOn(mockBlob, "arrayBuffer").mockResolvedValue(mockArrayBuffer);

            // Mock Buffer.from to throw an error
            const originalBufferFrom = Buffer.from;
            Buffer.from = vi.fn().mockImplementation(() => {
                throw new Error("Buffer creation failed");
            });

            const result = await loadNativeImage("http://example.com/image.png");

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalled();

            // Restore Buffer.from
            Buffer.from = originalBufferFrom;
        });
    });
});
