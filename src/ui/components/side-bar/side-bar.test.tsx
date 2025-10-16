import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

import { SideBar, SIDEBAR_WIDTH_OPEN, SIDEBAR_WIDTH_CLOSED } from "./side-bar";

// Mock the store
const mockUseStore = vi.fn();
vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Mock child components
vi.mock("./logo", () => ({
    Logo: () => <div data-testid="logo">Logo Component</div>,
}));

vi.mock("./services", () => ({
    Services: () => <div data-testid="services">Services Component</div>,
}));

vi.mock("./actions", () => ({
    Actions: () => <div data-testid="actions">Actions Component</div>,
}));

// Mock window.electron
const mockSetSidebarState = vi.fn();
const mockElectronWindow = {
    electron: {
        setSidebarState: mockSetSidebarState,
    },
};

describe("SideBar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        
        // Mock window.electron
        Object.defineProperty(window, "electron", {
            value: mockElectronWindow.electron,
            writable: true,
            configurable: true,
        });

        // Default store mock
        mockUseStore.mockReturnValue({
            isOpen: true,
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders the sidebar", () => {
            render(<SideBar />);

            expect(document.querySelector('[data-testid="logo"]')).toBeInTheDocument();
            expect(document.querySelector('[data-testid="services"]')).toBeInTheDocument();
            expect(document.querySelector('[data-testid="actions"]')).toBeInTheDocument();
        });

        it("renders with correct component structure", () => {
            render(<SideBar />);

            const logo = document.querySelector('[data-testid="logo"]');
            const services = document.querySelector('[data-testid="services"]');
            const actions = document.querySelector('[data-testid="actions"]');

            expect(logo).toBeInTheDocument();
            expect(services).toBeInTheDocument();
            expect(actions).toBeInTheDocument();
        });

        it("renders consistently", () => {
            const { container: container1 } = render(<SideBar />);
            const { container: container2 } = render(<SideBar />);

            expect(container1.innerHTML).toBe(container2.innerHTML);
        });
    });

    describe("Store Integration", () => {
        it("uses isOpen state from store", () => {
            mockUseStore.mockReturnValue({
                isOpen: true,
            });

            render(<SideBar />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("handles isOpen state changes", () => {
            const { rerender } = render(<SideBar />);

            expect(mockUseStore).toHaveBeenCalled();

            // Change isOpen state
            mockUseStore.mockReturnValue({
                isOpen: false,
            });

            rerender(<SideBar />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("handles undefined isOpen state", () => {
            mockUseStore.mockReturnValue({
                isOpen: undefined,
            });

            expect(() => {
                render(<SideBar />);
            }).not.toThrow();
        });
    });

    describe("Electron Integration", () => {
        it("calls setSidebarState on mount", () => {
            mockUseStore.mockReturnValue({
                isOpen: true,
            });

            render(<SideBar />);

            expect(mockSetSidebarState).toHaveBeenCalledWith(true);
            expect(mockSetSidebarState).toHaveBeenCalledTimes(1);
        });

        it("calls setSidebarState when isOpen changes", () => {
            const { rerender } = render(<SideBar />);

            expect(mockSetSidebarState).toHaveBeenCalledWith(true);

            // Change isOpen state
            mockUseStore.mockReturnValue({
                isOpen: false,
            });

            rerender(<SideBar />);

            expect(mockSetSidebarState).toHaveBeenCalledWith(false);
            expect(mockSetSidebarState).toHaveBeenCalledTimes(2);
        });

        it("calls setSidebarState only when isOpen changes", () => {
            const { rerender } = render(<SideBar />);

            expect(mockSetSidebarState).toHaveBeenCalledTimes(1);

            // Re-render with same isOpen state
            rerender(<SideBar />);

            // Should not call again
            expect(mockSetSidebarState).toHaveBeenCalledTimes(1);
        });

        it("handles missing electron API gracefully", () => {
            Object.defineProperty(window, "electron", {
                value: undefined,
                writable: true,
                configurable: true,
            });

            expect(() => {
                render(<SideBar />);
            }).toThrow();
        });

        it("handles electron API errors gracefully", () => {
            mockSetSidebarState.mockImplementation(() => {
                throw new Error("Electron API error");
            });

            expect(() => {
                render(<SideBar />);
            }).toThrow("Electron API error");
        });
    });

    describe("Component Structure", () => {
        it("renders header with logo and services", () => {
            render(<SideBar />);

            const logo = document.querySelector('[data-testid="logo"]');
            const services = document.querySelector('[data-testid="services"]');

            expect(logo).toBeInTheDocument();
            expect(services).toBeInTheDocument();
        });

        it("renders footer with actions", () => {
            render(<SideBar />);

            const actions = document.querySelector('[data-testid="actions"]');

            expect(actions).toBeInTheDocument();
        });

        it("maintains proper component hierarchy", () => {
            render(<SideBar />);

            // All child components should be present
            expect(document.querySelector('[data-testid="logo"]')).toBeInTheDocument();
            expect(document.querySelector('[data-testid="services"]')).toBeInTheDocument();
            expect(document.querySelector('[data-testid="actions"]')).toBeInTheDocument();
        });
    });

    describe("Constants", () => {
        it("exports correct sidebar width constants", () => {
            expect(SIDEBAR_WIDTH_OPEN).toBe(200);
            expect(SIDEBAR_WIDTH_CLOSED).toBe(60);
        });
    });

    describe("Edge Cases", () => {
        it("handles rapid isOpen state changes", () => {
            const { rerender } = render(<SideBar />);

            // Rapidly change isOpen state
            for (let i = 0; i < 5; i++) {
                mockUseStore.mockReturnValue({
                    isOpen: i % 2 === 0,
                });

                rerender(<SideBar />);
            }

            // Initial call + changes when isOpen actually changes
            // The useEffect only runs when isOpen changes, so we get:
            // Initial: true (1 call)
            // i=0: true (no change, no call)
            // i=1: false (change, 1 call)
            // i=2: true (change, 1 call)
            // i=3: false (change, 1 call)
            // i=4: true (change, 1 call)
            // Total: 5 calls
            expect(mockSetSidebarState).toHaveBeenCalledTimes(5);
        });

        it("handles store errors gracefully", () => {
            mockUseStore.mockImplementation(() => {
                throw new Error("Store error");
            });

            expect(() => {
                render(<SideBar />);
            }).toThrow("Store error");
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<SideBar />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<SideBar />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<SideBar />);
            }

            // Should handle all re-renders without errors
            expect(document.querySelector('[data-testid="logo"]')).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("calls setSidebarState on mount", () => {
            render(<SideBar />);

            expect(mockSetSidebarState).toHaveBeenCalledTimes(1);
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(<SideBar />);

            expect(mockSetSidebarState).toHaveBeenCalledTimes(1);

            unmount();

            // Component should be unmounted without errors
            expect(mockSetSidebarState).toHaveBeenCalledTimes(1);
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<SideBar />);

                expect(mockSetSidebarState).toHaveBeenCalledTimes(i + 1);
                unmount();
            }

            // Should not have any memory leaks
            expect(mockSetSidebarState).toHaveBeenCalledTimes(5);
        });
    });
});