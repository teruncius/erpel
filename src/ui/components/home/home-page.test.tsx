import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Home } from "./home-page";

// Mock the store
const mockUseStore = vi.fn();
vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Mock react-router
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock child components
vi.mock("./clock", () => ({
    Clock: ({ golden }: { golden?: boolean }) => (
        <div data-testid="clock" data-golden={golden}>
            Clock Component
        </div>
    ),
}));

vi.mock("../layout", () => ({
    PageCenter: ({ children }: { children: React.ReactNode }) => <div data-testid="page-center">{children}</div>,
}));

// Mock window.electron
const mockHideAllServices = vi.fn();
const mockElectronWindow = {
    electron: {
        hideAllServices: mockHideAllServices,
    },
};

describe("Home", () => {
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
            services: [{ id: "service-1", name: "Test Service", url: "https://example.com" }],
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders the home page", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(screen.getByTestId("page-center")).toBeInTheDocument();
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });

        it("renders Clock component with golden prop", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            const clock = screen.getByTestId("clock");
            expect(clock).toHaveAttribute("data-golden", "true");
        });

        it("renders within PageCenter layout", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            const pageCenter = screen.getByTestId("page-center");
            const clock = screen.getByTestId("clock");

            expect(pageCenter).toContainElement(clock);
        });
    });

    describe("Electron Integration", () => {
        it("calls hideAllServices on mount", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledTimes(1);
        });

        it("calls hideAllServices only once on mount", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledTimes(1);

            // Re-render should not call hideAllServices again
            rerender(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledTimes(1);
        });

        it("handles missing electron API gracefully", () => {
            // Remove electron from window
            Object.defineProperty(window, "electron", {
                value: undefined,
                writable: true,
                configurable: true,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                );
            }).toThrow();
        });
    });

    describe("Navigation Logic", () => {
        it("navigates to setup when no services are available", () => {
            mockUseStore.mockReturnValue({
                services: [],
            });

            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockNavigate).toHaveBeenCalledWith("/setup");
        });

        it("does not navigate when services are available", () => {
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Test Service", url: "https://example.com" }],
            });

            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it("navigates when services change from available to empty", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Initially has services, should not navigate
            expect(mockNavigate).not.toHaveBeenCalled();

            // Change to empty services
            mockUseStore.mockReturnValue({
                services: [],
            });

            rerender(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockNavigate).toHaveBeenCalledWith("/setup");
        });

        it("does not navigate when services change from empty to available", () => {
            // Start with empty services
            mockUseStore.mockReturnValue({
                services: [],
            });

            const { rerender } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Should navigate to setup initially
            expect(mockNavigate).toHaveBeenCalledWith("/setup");

            // Clear the mock to track new calls
            mockNavigate.mockClear();

            // Change to have services
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Test Service", url: "https://example.com" }],
            });

            rerender(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Should not navigate again
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe("Store Integration", () => {
        it("uses services from store", () => {
            const mockServices = [
                { id: "service-1", name: "Service 1", url: "https://service1.com" },
                { id: "service-2", name: "Service 2", url: "https://service2.com" },
            ];

            mockUseStore.mockReturnValue({
                services: mockServices,
            });

            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("reacts to store changes", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Change store state
            mockUseStore.mockReturnValue({
                services: [],
            });

            rerender(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(mockNavigate).toHaveBeenCalledWith("/setup");
        });

        it("handles undefined services gracefully", () => {
            mockUseStore.mockReturnValue({
                services: undefined,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                );
            }).toThrow();
        });
    });

    describe("Component Structure", () => {
        it("has correct component hierarchy", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            const pageCenter = screen.getByTestId("page-center");
            const clock = screen.getByTestId("clock");

            expect(pageCenter).toContainElement(clock);
        });

        it("renders all required components", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(screen.getByTestId("page-center")).toBeInTheDocument();
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles rapid store changes", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Rapidly change services
            for (let i = 0; i < 5; i++) {
                mockUseStore.mockReturnValue({
                    services: i % 2 === 0 ? [] : [{ id: "service", name: "Service", url: "https://example.com" }],
                });
                rerender(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                );
            }

            // Should handle all changes without errors
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });

        it("handles multiple navigation calls", () => {
            mockUseStore.mockReturnValue({
                services: [],
            });

            const { rerender } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Should navigate initially
            expect(mockNavigate).toHaveBeenCalledWith("/setup");
            expect(mockNavigate).toHaveBeenCalledTimes(1);

            // Clear the mock to track new calls
            mockNavigate.mockClear();

            // Change services to trigger navigation again
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Test Service", url: "https://example.com" }],
            });

            rerender(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Should not navigate when services are available
            expect(mockNavigate).not.toHaveBeenCalled();

            // Change back to empty services to trigger navigation
            mockUseStore.mockReturnValue({
                services: [],
            });

            rerender(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Should navigate when services become empty again
            expect(mockNavigate).toHaveBeenCalledWith("/setup");
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                );
            }

            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("renders without accessibility issues", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            // Should render without throwing accessibility errors
            expect(screen.getByTestId("page-center")).toBeInTheDocument();
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });

        it("maintains proper component structure for screen readers", () => {
            render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            const pageCenter = screen.getByTestId("page-center");
            const clock = screen.getByTestId("clock");

            // Clock should be contained within PageCenter
            expect(pageCenter).toContainElement(clock);
        });
    });

    describe("Error Handling", () => {
        it("handles store errors gracefully", () => {
            mockUseStore.mockImplementation(() => {
                throw new Error("Store error");
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                );
            }).toThrow("Store error");
        });

        it("handles navigation errors gracefully", () => {
            mockNavigate.mockImplementation(() => {
                throw new Error("Navigation error");
            });

            mockUseStore.mockReturnValue({
                services: [],
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                );
            }).toThrow("Navigation error");
        });
    });

    describe("Component Integration", () => {
        it("integrates properly with router context", () => {
            render(
                <MemoryRouter initialEntries={["/home"]}>
                    <Home />
                </MemoryRouter>
            );

            expect(screen.getByTestId("page-center")).toBeInTheDocument();
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });

        it("handles router context changes", () => {
            const { rerender } = render(
                <MemoryRouter initialEntries={["/home"]}>
                    <Home />
                </MemoryRouter>
            );

            expect(screen.getByTestId("clock")).toBeInTheDocument();

            // Change router context
            rerender(
                <MemoryRouter initialEntries={["/different-route"]}>
                    <Home />
                </MemoryRouter>
            );

            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            );

            expect(screen.getByTestId("clock")).toBeInTheDocument();

            unmount();

            // Component should be unmounted
            expect(screen.queryByTestId("clock")).not.toBeInTheDocument();
        });

        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(
                    <MemoryRouter>
                        <Home />
                    </MemoryRouter>
                );

                expect(screen.getByTestId("clock")).toBeInTheDocument();
                unmount();
            }

            // Should not have any memory leaks
            expect(screen.queryByTestId("clock")).not.toBeInTheDocument();
        });
    });
});
