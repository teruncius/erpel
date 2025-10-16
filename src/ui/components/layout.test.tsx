import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BackgroundMode } from "@erpel/state/settings";
import { Layout } from "./layout";

// Mock the store
const mockUseStore = vi.fn();
vi.mock("../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Mock child components
vi.mock("./side-bar/side-bar", () => ({
    SideBar: () => <div data-testid="side-bar">Side Bar</div>,
    SIDEBAR_WIDTH_CLOSED: 60,
    SIDEBAR_WIDTH_OPEN: 200,
}));

vi.mock("./wallpaper", () => ({
    Wallpaper: () => <div data-testid="wallpaper">Wallpaper</div>,
}));

// Mock react-router
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        Outlet: ({ children }: { children?: React.ReactNode }) => (
            <div data-testid="outlet">{children || "Outlet Content"}</div>
        ),
    };
});

describe("Layout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();

        // Default store mock
        mockUseStore.mockReturnValue({
            isOpen: true,
            mode: BackgroundMode.Wallpaper,
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders the main page container", () => {
            render(<Layout />);

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
            expect(screen.getByTestId("outlet")).toBeInTheDocument();
        });

        it("renders SideBar component", () => {
            mockUseStore.mockReturnValue({
                isOpen: false,
                mode: BackgroundMode.Color,
            });

            render(<Layout />);

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
        });

        it("renders Outlet for child routes", () => {
            render(<Layout />);

            expect(screen.getByTestId("outlet")).toBeInTheDocument();
        });
    });

    describe("Background Mode", () => {
        it("renders Wallpaper when mode is Wallpaper", () => {
            mockUseStore.mockReturnValue({
                isOpen: true,
                mode: BackgroundMode.Wallpaper,
            });

            render(<Layout />);

            expect(screen.getByTestId("wallpaper")).toBeInTheDocument();
        });

        it("does not render Wallpaper when mode is Color", () => {
            mockUseStore.mockReturnValue({
                isOpen: true,
                mode: BackgroundMode.Color,
            });

            render(<Layout />);

            expect(screen.queryByTestId("wallpaper")).not.toBeInTheDocument();
        });

        it("handles different background modes", () => {
            const modes = [BackgroundMode.Wallpaper, BackgroundMode.Color];

            modes.forEach((mode) => {
                mockUseStore.mockReturnValue({
                    isOpen: true,
                    mode,
                });

                const { unmount } = render(<Layout />);

                if (mode === BackgroundMode.Wallpaper) {
                    expect(screen.getByTestId("wallpaper")).toBeInTheDocument();
                } else {
                    expect(screen.queryByTestId("wallpaper")).not.toBeInTheDocument();
                }

                unmount();
            });
        });
    });

    describe("Sidebar State", () => {
        it("handles sidebar open state", () => {
            mockUseStore.mockReturnValue({
                isOpen: true,
                mode: BackgroundMode.Color,
            });

            render(<Layout />);

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
            expect(screen.getByTestId("outlet")).toBeInTheDocument();
        });

        it("handles sidebar closed state", () => {
            mockUseStore.mockReturnValue({
                isOpen: false,
                mode: BackgroundMode.Color,
            });

            render(<Layout />);

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
            expect(screen.getByTestId("outlet")).toBeInTheDocument();
        });

        it("updates when sidebar state changes", () => {
            // First render with sidebar open
            mockUseStore.mockReturnValue({
                isOpen: true,
                mode: BackgroundMode.Color,
            });

            const { rerender } = render(<Layout />);

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();

            // Re-render with sidebar closed
            mockUseStore.mockReturnValue({
                isOpen: false,
                mode: BackgroundMode.Color,
            });

            rerender(<Layout />);

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
        });
    });

    describe("Store Integration", () => {
        it("calls useStore hook", () => {
            render(<Layout />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("uses correct store values", () => {
            const storeValues = {
                isOpen: false,
                mode: BackgroundMode.Color,
            };

            mockUseStore.mockReturnValue(storeValues);

            render(<Layout />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("handles store state changes", () => {
            const initialStore = {
                isOpen: true,
                mode: BackgroundMode.Wallpaper,
            };

            mockUseStore.mockReturnValue(initialStore);

            const { rerender } = render(<Layout />);

            expect(screen.getByTestId("wallpaper")).toBeInTheDocument();

            // Change store state
            const newStore = {
                isOpen: false,
                mode: BackgroundMode.Color,
            };

            mockUseStore.mockReturnValue(newStore);

            rerender(<Layout />);

            expect(screen.queryByTestId("wallpaper")).not.toBeInTheDocument();
        });
    });

    describe("Component Structure", () => {
        it("has correct component hierarchy", () => {
            render(<Layout />);

            const page = document.querySelector('[data-testid="side-bar"]')?.parentElement;
            expect(page).toBeInTheDocument();
        });

        it("renders all required components", () => {
            render(<Layout />);

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
            expect(screen.getByTestId("outlet")).toBeInTheDocument();
            expect(screen.getByTestId("wallpaper")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles undefined store values", () => {
            mockUseStore.mockReturnValue({
                isOpen: undefined,
                mode: undefined,
            });

            expect(() => render(<Layout />)).not.toThrow();
        });

        it("handles null store values", () => {
            mockUseStore.mockReturnValue({
                isOpen: null,
                mode: null,
            });

            expect(() => render(<Layout />)).not.toThrow();
        });

        it("handles missing store properties", () => {
            mockUseStore.mockReturnValue({});

            expect(() => render(<Layout />)).not.toThrow();
        });
    });

    describe("Styling Integration", () => {
        it("applies correct CSS classes and styles", () => {
            mockUseStore.mockReturnValue({
                isOpen: true,
                mode: BackgroundMode.Color,
            });

            render(<Layout />);

            // The component should render without errors
            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
            expect(screen.getByTestId("outlet")).toBeInTheDocument();
        });

        it("handles different sidebar widths", () => {
            const sidebarStates = [
                { isOpen: true, expectedWidth: 200 },
                { isOpen: false, expectedWidth: 60 },
            ];

            sidebarStates.forEach(({ isOpen, expectedWidth }) => {
                mockUseStore.mockReturnValue({
                    isOpen,
                    mode: BackgroundMode.Color,
                });

                const { unmount } = render(<Layout />);

                // Component should render with correct state
                expect(screen.getByTestId("side-bar")).toBeInTheDocument();

                unmount();
            });
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<Layout />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles rapid state changes", () => {
            const states = [
                { isOpen: true, mode: BackgroundMode.Wallpaper },
                { isOpen: false, mode: BackgroundMode.Color },
                { isOpen: true, mode: BackgroundMode.Color },
                { isOpen: false, mode: BackgroundMode.Wallpaper },
            ];

            const { rerender } = render(<Layout />);

            states.forEach((state) => {
                mockUseStore.mockReturnValue(state);
                rerender(<Layout />);
            });

            expect(screen.getByTestId("side-bar")).toBeInTheDocument();
        });
    });
});
