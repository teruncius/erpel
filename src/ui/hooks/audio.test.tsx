import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useAudio } from "./audio";

// Mock Audio constructor and methods
const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockPause = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

// Mock Audio constructor
const MockAudio = vi.fn().mockImplementation(() => ({
    play: mockPlay,
    pause: mockPause,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
}));

// Replace global Audio with our mock
Object.defineProperty(window, "Audio", {
    value: MockAudio,
    writable: true,
});

describe("useAudio", () => {
    const testUrl = "https://example.com/audio.mp3";

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset Audio mock implementation
        MockAudio.mockImplementation(() => ({
            play: mockPlay,
            pause: mockPause,
            addEventListener: mockAddEventListener,
            removeEventListener: mockRemoveEventListener,
        }));
        // Reset play mock to return resolved promise by default
        mockPlay.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Initialization", () => {
        it("should create Audio instance with provided URL", () => {
            renderHook(() => useAudio(testUrl));

            expect(MockAudio).toHaveBeenCalledWith(testUrl);
            expect(MockAudio).toHaveBeenCalledTimes(1);
        });

        it("should return initial state", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            const [playing, toggle, play] = result.current;

            expect(playing).toBe(false);
            expect(typeof toggle).toBe("function");
            expect(typeof play).toBe("function");
        });

        it("should set up ended event listener", () => {
            renderHook(() => useAudio(testUrl));

            expect(mockAddEventListener).toHaveBeenCalledWith("ended", expect.any(Function));
        });
    });

    describe("Audio playback control", () => {
        it("should play audio when playing state is true", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            act(() => {
                result.current[1](); // toggle to true
            });

            expect(mockPlay).toHaveBeenCalled();
        });

        it("should pause audio when playing state is false", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            // First set playing to true
            act(() => {
                result.current[1](); // toggle to true
            });

            // Then set it back to false
            act(() => {
                result.current[1](); // toggle to false
            });

            expect(mockPause).toHaveBeenCalled();
        });

        it("should handle play promise rejection", async () => {
            const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            mockPlay.mockRejectedValue(new Error("Play failed"));

            const { result } = renderHook(() => useAudio(testUrl));

            act(() => {
                result.current[1](); // toggle to true
            });

            expect(mockPlay).toHaveBeenCalled();
            
            // Wait for the promise rejection to be handled
            await new Promise(resolve => setTimeout(resolve, 0));
            
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

            consoleSpy.mockRestore();
        });
    });

    describe("Toggle functionality", () => {
        it("should toggle playing state from false to true", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[1](); // toggle
            });

            expect(result.current[0]).toBe(true);
        });

        it("should toggle playing state from true to false", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            // First set to true
            act(() => {
                result.current[1](); // toggle to true
            });

            expect(result.current[0]).toBe(true);

            // Then toggle back to false
            act(() => {
                result.current[1](); // toggle to false
            });

            expect(result.current[0]).toBe(false);
        });

        it("should maintain toggle function reference", () => {
            const { result, rerender } = renderHook(() => useAudio(testUrl));

            const initialToggle = result.current[1];

            rerender();

            expect(result.current[1]).toBe(initialToggle);
        });
    });

    describe("Play functionality", () => {
        it("should set playing state to true", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[2](); // play
            });

            expect(result.current[0]).toBe(true);
        });

        it("should maintain play function reference", () => {
            const { result, rerender } = renderHook(() => useAudio(testUrl));

            const initialPlay = result.current[2];

            rerender();

            expect(result.current[2]).toBe(initialPlay);
        });
    });

    describe("Audio ended event", () => {
        it("should set playing to false when audio ends", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            // Set playing to true first
            act(() => {
                result.current[1](); // toggle to true
            });

            expect(result.current[0]).toBe(true);

            // Get the ended event handler
            const endedHandler = mockAddEventListener.mock.calls.find(
                (call) => call[0] === "ended"
            )?.[1];

            // Simulate audio ended event
            act(() => {
                endedHandler();
            });

            expect(result.current[0]).toBe(false);
        });

        it("should clean up event listener on unmount", () => {
            const { unmount } = renderHook(() => useAudio(testUrl));

            // Get the ended event handler
            const endedHandler = mockAddEventListener.mock.calls.find(
                (call) => call[0] === "ended"
            )?.[1];

            unmount();

            expect(mockRemoveEventListener).toHaveBeenCalledWith("ended", endedHandler);
        });
    });

    describe("Multiple instances", () => {
        it("should create separate Audio instances for different URLs", () => {
            const url1 = "https://example.com/audio1.mp3";
            const url2 = "https://example.com/audio2.mp3";

            renderHook(() => useAudio(url1));
            renderHook(() => useAudio(url2));

            expect(MockAudio).toHaveBeenCalledWith(url1);
            expect(MockAudio).toHaveBeenCalledWith(url2);
            expect(MockAudio).toHaveBeenCalledTimes(2);
        });

        it("should maintain independent state for different instances", () => {
            const { result: result1 } = renderHook(() => useAudio("url1"));
            const { result: result2 } = renderHook(() => useAudio("url2"));

            // Toggle first instance
            act(() => {
                result1.current[1](); // toggle first instance
            });

            expect(result1.current[0]).toBe(true);
            expect(result2.current[0]).toBe(false);

            // Toggle second instance
            act(() => {
                result2.current[1](); // toggle second instance
            });

            expect(result1.current[0]).toBe(true);
            expect(result2.current[0]).toBe(true);
        });
    });

    describe("URL changes", () => {
        it("should create new Audio instance when URL changes", () => {
            const { rerender } = renderHook(
                ({ url }) => useAudio(url),
                { initialProps: { url: "url1" } }
            );

            expect(MockAudio).toHaveBeenCalledWith("url1");

            rerender({ url: "url2" });

            expect(MockAudio).toHaveBeenCalledWith("url2");
            expect(MockAudio).toHaveBeenCalledTimes(2);
        });
    });

    describe("Edge cases", () => {
        it("should handle empty URL", () => {
            const { result } = renderHook(() => useAudio(""));

            expect(MockAudio).toHaveBeenCalledWith("");
            expect(result.current[0]).toBe(false);
        });

        it("should handle undefined URL", () => {
            const { result } = renderHook(() => useAudio(undefined as any));

            expect(MockAudio).toHaveBeenCalledWith(undefined);
            expect(result.current[0]).toBe(false);
        });

        it("should handle rapid toggles", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            act(() => {
                result.current[1](); // toggle
                result.current[1](); // toggle
                result.current[1](); // toggle
            });

            expect(result.current[0]).toBe(true);
        });

        it("should handle rapid play calls", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            act(() => {
                result.current[2](); // play
                result.current[2](); // play
                result.current[2](); // play
            });

            expect(result.current[0]).toBe(true);
        });
    });

    describe("Function references", () => {
        it("should maintain stable function references across renders", () => {
            const { result, rerender } = renderHook(() => useAudio(testUrl));

            const [playing1, toggle1, play1] = result.current;

            rerender();

            const [playing2, toggle2, play2] = result.current;

            expect(toggle1).toBe(toggle2);
            expect(play1).toBe(play2);
            expect(playing1).toBe(playing2);
        });
    });

    describe("Type safety", () => {
        it("should return correct hook type", () => {
            const { result } = renderHook(() => useAudio(testUrl));

            const [playing, toggle, play] = result.current;

            expect(typeof playing).toBe("boolean");
            expect(typeof toggle).toBe("function");
            expect(typeof play).toBe("function");
        });
    });
});
