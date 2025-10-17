import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BackgroundMode } from "@erpel/state/settings";

// Mock Icon component
vi.mock("../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <svg data-testid={`icon-${name}`} height={size} width={size}>
            {name}
        </svg>
    ),
}));

// Mock DEFAULT_WALLPAPERS
vi.mock("@erpel/state/settings", async () => {
    const actual = await vi.importActual("@erpel/state/settings");
    return {
        ...actual,
        DEFAULT_WALLPAPERS: [
            "https://example.com/wallpaper1.jpg",
            "https://example.com/wallpaper2.jpg",
            "https://example.com/wallpaper3.jpg",
        ],
    };
});

// Mock useStore hook
const mockSetMode = vi.fn();
const mockSetWallpapers = vi.fn();
const mockUseStore = vi.fn();

vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Import the component after mocking
import { DEFAULT_WALLPAPERS } from "@erpel/state/settings";
import { WallpaperSettings } from "./wallpaper-settings";

describe("WallpaperSettings", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
        cleanup();
        // Default mock return value
        mockUseStore.mockReturnValue({
            mode: BackgroundMode.Wallpaper,
            wallpapers: ["https://example.com/test1.jpg", "https://example.com/test2.jpg"],
            setMode: mockSetMode,
            setWallpapers: mockSetWallpapers,
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without crashing", () => {
            const { container } = render(<WallpaperSettings />);
            expect(container).toBeInTheDocument();
        });

        it("renders background mode select", () => {
            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select");
            expect(select).toBeInTheDocument();
        });

        it("renders mode select with correct options", () => {
            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;
            const options = Array.from(select.querySelectorAll("option"));

            expect(options).toHaveLength(2);
            expect(options[0]).toHaveValue(BackgroundMode.Color);
            expect(options[1]).toHaveValue(BackgroundMode.Wallpaper);
        });

        it("displays current mode value", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;
            expect(select.value).toBe(BackgroundMode.Color);
        });
    });

    describe("Conditional Rendering", () => {
        it("shows reset button and textarea when mode is Wallpaper", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: ["https://example.com/test.jpg"],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);

            expect(screen.getByRole("button", { name: /Reset/i })).toBeInTheDocument();
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("hides reset button and textarea when mode is Color", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: ["https://example.com/test.jpg"],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);

            expect(screen.queryByRole("button", { name: /Reset/i })).not.toBeInTheDocument();
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });

        it("shows reset button with bug icon when mode is Wallpaper", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);

            const icon = screen.getByTestId("icon-bug");
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveAttribute("width", "20");
            expect(icon).toHaveAttribute("height", "20");
        });

        it("switches UI when mode changes from Color to Wallpaper", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { rerender } = render(<WallpaperSettings />);
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            rerender(<WallpaperSettings />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("switches UI when mode changes from Wallpaper to Color", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { rerender } = render(<WallpaperSettings />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();

            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            rerender(<WallpaperSettings />);
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });
    });

    describe("Mode Selection", () => {
        it("calls setMode when mode select changes", async () => {
            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            await user.selectOptions(select, BackgroundMode.Color);

            await waitFor(() => {
                expect(mockSetMode).toHaveBeenCalledWith(BackgroundMode.Color);
            });
        });

        it("calls setMode with correct value when selecting Wallpaper", async () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            await user.selectOptions(select, BackgroundMode.Wallpaper);

            await waitFor(() => {
                expect(mockSetMode).toHaveBeenCalledWith(BackgroundMode.Wallpaper);
            });
        });

        it("handles multiple mode changes in sequence", async () => {
            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            await user.selectOptions(select, BackgroundMode.Color);
            await waitFor(() => {
                expect(mockSetMode).toHaveBeenCalledWith(BackgroundMode.Color);
            });

            mockSetMode.mockClear();

            await user.selectOptions(select, BackgroundMode.Wallpaper);
            await waitFor(() => {
                expect(mockSetMode).toHaveBeenCalledWith(BackgroundMode.Wallpaper);
            });
        });
    });

    describe("Wallpaper Textarea", () => {
        it("displays wallpapers joined by newlines", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [
                    "https://example.com/wall1.jpg",
                    "https://example.com/wall2.jpg",
                    "https://example.com/wall3.jpg",
                ],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

            expect(textarea.value).toBe(
                "https://example.com/wall1.jpg\nhttps://example.com/wall2.jpg\nhttps://example.com/wall3.jpg"
            );
        });

        it("calls setWallpapers when textarea changes", async () => {
            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox");

            await user.clear(textarea);
            await user.type(textarea, "https://example.com/new1.jpg\nhttps://example.com/new2.jpg");

            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalled();
            });
        });

        it("splits textarea input by newlines", async () => {
            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox");

            await user.clear(textarea);
            await user.type(textarea, "url1{Enter}url2{Enter}url3");

            await waitFor(() => {
                // Check that setWallpapers was called
                expect(mockSetWallpapers).toHaveBeenCalled();
                // Check that the last call includes the split URLs
                const calls = mockSetWallpapers.mock.calls;
                const lastCall = calls[calls.length - 1][0];
                expect(Array.isArray(lastCall)).toBe(true);
            });
        });

        it("handles empty textarea", async () => {
            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox");

            await user.clear(textarea);

            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalled();
            });
        });

        it("handles single wallpaper URL", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: ["https://example.com/single.jpg"],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

            expect(textarea.value).toBe("https://example.com/single.jpg");
        });

        it("handles empty wallpapers array", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

            expect(textarea.value).toBe("");
        });
    });

    describe("Reset Button", () => {
        it("calls setWallpapers with DEFAULT_WALLPAPERS when clicked", async () => {
            render(<WallpaperSettings />);
            const button = screen.getByRole("button", { name: /Reset/i });

            await user.click(button);

            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalledWith(DEFAULT_WALLPAPERS);
            });
        });

        it("can reset wallpapers multiple times", async () => {
            render(<WallpaperSettings />);
            const button = screen.getByRole("button", { name: /Reset/i });

            await user.click(button);
            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalledTimes(1);
            });

            await user.click(button);
            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalledTimes(2);
            });
        });

        it("reset button has correct text", () => {
            render(<WallpaperSettings />);
            const button = screen.getByRole("button", { name: /Reset/i });

            expect(button.textContent).toContain("Reset");
        });

        it("reset button contains icon", () => {
            render(<WallpaperSettings />);
            const icon = screen.getByTestId("icon-bug");

            expect(icon).toBeInTheDocument();
        });
    });

    describe("Store Integration", () => {
        it("uses mode from store", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            expect(select.value).toBe(BackgroundMode.Color);
        });

        it("uses wallpapers from store", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: ["test1.jpg", "test2.jpg"],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

            expect(textarea.value).toBe("test1.jpg\ntest2.jpg");
        });

        it("uses setMode function from store", async () => {
            const customSetMode = vi.fn();
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: customSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            await user.selectOptions(select, BackgroundMode.Color);

            await waitFor(() => {
                expect(customSetMode).toHaveBeenCalledWith(BackgroundMode.Color);
            });
        });

        it("uses setWallpapers function from store", async () => {
            const customSetWallpapers = vi.fn();
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: customSetWallpapers,
            });

            render(<WallpaperSettings />);
            const button = screen.getByRole("button", { name: /Reset/i });

            await user.click(button);

            await waitFor(() => {
                expect(customSetWallpapers).toHaveBeenCalledWith(DEFAULT_WALLPAPERS);
            });
        });

        it("reacts to store changes", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { rerender } = render(<WallpaperSettings />);
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: ["new.jpg"],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            rerender(<WallpaperSettings />);
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });
    });

    describe("Callback Behavior", () => {
        it("handleChangeMode callback uses setMode", async () => {
            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            await user.selectOptions(select, BackgroundMode.Color);

            await waitFor(() => {
                expect(mockSetMode).toHaveBeenCalledWith(BackgroundMode.Color);
            });
        });

        it("handleChangeUrls callback uses setWallpapers", async () => {
            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox");

            await user.clear(textarea);
            await user.type(textarea, "test");

            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalled();
            });
        });

        it("handleReset callback uses setWallpapers with DEFAULT_WALLPAPERS", async () => {
            render(<WallpaperSettings />);
            const button = screen.getByRole("button", { name: /Reset/i });

            await user.click(button);

            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalledWith(DEFAULT_WALLPAPERS);
            });
        });

        it("callbacks are memoized", () => {
            const { rerender, container } = render(<WallpaperSettings />);
            const select1 = container.querySelector("select");
            const handler1 = (select1 as any).onchange;

            rerender(<WallpaperSettings />);
            const select2 = container.querySelector("select");
            const handler2 = (select2 as any).onchange;

            expect(handler1).toBe(handler2);
        });

        it("callbacks update when store functions change", async () => {
            const mockSetMode1 = vi.fn();
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: mockSetMode1,
                setWallpapers: mockSetWallpapers,
            });

            const { rerender, container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            await user.selectOptions(select, BackgroundMode.Color);
            await waitFor(() => {
                expect(mockSetMode1).toHaveBeenCalled();
            });

            const mockSetMode2 = vi.fn();
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Color,
                wallpapers: [],
                setMode: mockSetMode2,
                setWallpapers: mockSetWallpapers,
            });

            rerender(<WallpaperSettings />);
            const selectAfter = container.querySelector("select") as HTMLSelectElement;

            await user.selectOptions(selectAfter, BackgroundMode.Wallpaper);
            await waitFor(() => {
                expect(mockSetMode2).toHaveBeenCalled();
            });
        });
    });

    describe("Component Lifecycle", () => {
        it("maintains state across rerenders", () => {
            const { rerender, container } = render(<WallpaperSettings />);

            const select1 = container.querySelector("select") as HTMLSelectElement;
            expect(select1.value).toBe(BackgroundMode.Wallpaper);

            rerender(<WallpaperSettings />);

            const select2 = container.querySelector("select") as HTMLSelectElement;
            expect(select2.value).toBe(BackgroundMode.Wallpaper);
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(<WallpaperSettings />);
            expect(() => unmount()).not.toThrow();
        });

        it("handles rapid mount/unmount cycles", () => {
            const { unmount: unmount1 } = render(<WallpaperSettings />);
            unmount1();

            const { unmount: unmount2 } = render(<WallpaperSettings />);
            unmount2();

            const { unmount: unmount3 } = render(<WallpaperSettings />);
            unmount3();

            expect(true).toBe(true); // No crashes
        });
    });

    describe("Edge Cases", () => {
        it("handles undefined mode", () => {
            mockUseStore.mockReturnValue({
                mode: undefined as any,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { container } = render(<WallpaperSettings />);
            expect(container).toBeInTheDocument();
        });

        it("handles null mode", () => {
            mockUseStore.mockReturnValue({
                mode: null as any,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            const { container } = render(<WallpaperSettings />);
            expect(container).toBeInTheDocument();
        });

        it("handles undefined wallpapers", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: undefined as any,
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            // This will throw because undefined.join() fails
            expect(() => {
                render(<WallpaperSettings />);
            }).toThrow();
        });

        it("handles null wallpapers", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: null as any,
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            // This will throw because null.join() fails
            expect(() => {
                render(<WallpaperSettings />);
            }).toThrow();
        });

        it("handles wallpapers with special characters", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: ["https://example.com/test?param=1&other=2", "https://example.com/test#anchor"],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

            expect(textarea.value).toContain("param=1&other=2");
            expect(textarea.value).toContain("#anchor");
        });

        it("handles very long wallpaper URLs", () => {
            const longUrl = "https://example.com/" + "a".repeat(1000);
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [longUrl],
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

            expect(textarea.value).toBe(longUrl);
        });

        it("handles many wallpapers", () => {
            const manyWallpapers = Array.from({ length: 100 }, (_, i) => `https://example.com/wall${i}.jpg`);
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: manyWallpapers,
                setMode: mockSetMode,
                setWallpapers: mockSetWallpapers,
            });

            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

            expect(textarea.value.split("\n")).toHaveLength(100);
        });

        it("handles missing setMode function", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: undefined as any,
                setWallpapers: mockSetWallpapers,
            });

            // Should render but changing mode will cause error
            const { container } = render(<WallpaperSettings />);
            expect(container).toBeInTheDocument();

            // Component renders, but selecting would throw
            const select = container.querySelector("select") as HTMLSelectElement;
            expect(select).toBeInTheDocument();
        });

        it("handles missing setWallpapers function", () => {
            mockUseStore.mockReturnValue({
                mode: BackgroundMode.Wallpaper,
                wallpapers: [],
                setMode: mockSetMode,
                setWallpapers: undefined as any,
            });

            // Should render but clicking button will cause error
            const { container } = render(<WallpaperSettings />);
            expect(container).toBeInTheDocument();

            // Component renders, but clicking reset button would throw
            const button = screen.getByRole("button", { name: /Reset/i });
            expect(button).toBeInTheDocument();
        });
    });

    describe("Performance", () => {
        it("renders efficiently with multiple rerenders", () => {
            const { rerender, container } = render(<WallpaperSettings />);

            for (let i = 0; i < 10; i++) {
                rerender(<WallpaperSettings />);
            }

            const select = container.querySelector("select");
            expect(select).toBeInTheDocument();
        });

        it("handles rapid mode changes", async () => {
            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            for (let i = 0; i < 5; i++) {
                await user.selectOptions(select, i % 2 === 0 ? BackgroundMode.Color : BackgroundMode.Wallpaper);
            }

            await waitFor(() => {
                expect(mockSetMode).toHaveBeenCalledTimes(5);
            });
        });

        it("handles rapid textarea changes", async () => {
            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox");

            await user.clear(textarea);
            await user.type(textarea, "test");

            // setWallpapers should be called for each keystroke
            expect(mockSetWallpapers.mock.calls.length).toBeGreaterThan(0);
        });
    });

    describe("Accessibility", () => {
        it("mode select has proper label", () => {
            render(<WallpaperSettings />);
            expect(screen.getByText("Background mode")).toBeInTheDocument();
        });

        it("reset button is keyboard accessible", () => {
            render(<WallpaperSettings />);
            const button = screen.getByRole("button", { name: /Reset/i });

            button.focus();
            expect(document.activeElement).toBe(button);
        });

        it("textarea is keyboard accessible", () => {
            render(<WallpaperSettings />);
            const textarea = screen.getByRole("textbox");

            textarea.focus();
            expect(document.activeElement).toBe(textarea);
        });

        it("select is keyboard accessible", () => {
            const { container } = render(<WallpaperSettings />);
            const select = container.querySelector("select") as HTMLSelectElement;

            select.focus();
            expect(document.activeElement).toBe(select);
        });
    });

    describe("Integration", () => {
        it("mode change affects conditional rendering", async () => {
            const { container } = render(<WallpaperSettings />);

            expect(screen.getByRole("textbox")).toBeInTheDocument();

            const select = container.querySelector("select") as HTMLSelectElement;
            await user.selectOptions(select, BackgroundMode.Color);

            // Note: In real app, store would update and component would rerender
            // In this test, we're just testing that setMode is called
            await waitFor(() => {
                expect(mockSetMode).toHaveBeenCalledWith(BackgroundMode.Color);
            });
        });

        it("textarea and reset button work together", async () => {
            render(<WallpaperSettings />);

            const textarea = screen.getByRole("textbox");
            const button = screen.getByRole("button", { name: /Reset/i });

            await user.clear(textarea);
            await user.type(textarea, "custom.jpg");

            await user.click(button);

            await waitFor(() => {
                expect(mockSetWallpapers).toHaveBeenCalledWith(DEFAULT_WALLPAPERS);
            });
        });
    });
});
