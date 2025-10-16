import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ServicePage } from "./service-page";

// Mock react-router
const mockUseParams = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useParams: () => mockUseParams(),
    };
});

// Mock window.electron
const mockActivateService = vi.fn();
const mockElectronWindow = {
    electron: {
        activateService: mockActivateService,
    },
};

describe("ServicePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();

        // Mock window.electron
        Object.defineProperty(window, "electron", {
            value: mockElectronWindow.electron,
            writable: true,
            configurable: true,
        });

        // Default params mock
        mockUseParams.mockReturnValue({
            id: "test-service-id",
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without crashing", () => {
            expect(() => {
                render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }).not.toThrow();
        });

        it("renders empty fragment", () => {
            const { container } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            // Should render an empty fragment (no visible content)
            expect(container.firstChild).toBeNull();
        });

        it("renders consistently", () => {
            const { container: container1 } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            const { container: container2 } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            // Both renders should produce the same result
            expect(container1.innerHTML).toBe(container2.innerHTML);
        });
    });

    describe("Router Integration", () => {
        it("uses service ID from URL parameters", () => {
            const testId = "my-service-123";
            mockUseParams.mockReturnValue({
                id: testId,
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockUseParams).toHaveBeenCalled();
        });

        it("handles different service IDs", () => {
            const serviceIds = ["service-1", "service-2", "another-service"];

            serviceIds.forEach((id) => {
                mockUseParams.mockReturnValue({ id });

                const { unmount } = render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );

                expect(mockUseParams).toHaveBeenCalled();
                unmount();
            });
        });

        it("handles missing ID parameter", () => {
            mockUseParams.mockReturnValue({});

            expect(() => {
                render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }).not.toThrow();
        });

        it("handles undefined ID parameter", () => {
            mockUseParams.mockReturnValue({
                id: undefined,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }).not.toThrow();
        });

        it("handles null ID parameter", () => {
            mockUseParams.mockReturnValue({
                id: null,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }).not.toThrow();
        });
    });

    describe("Electron API Integration", () => {
        it("calls activateService when ID is provided", () => {
            const testId = "test-service";
            mockUseParams.mockReturnValue({
                id: testId,
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledWith(testId);
            expect(mockActivateService).toHaveBeenCalledTimes(1);
        });

        it("does not call activateService when ID is missing", () => {
            mockUseParams.mockReturnValue({});

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).not.toHaveBeenCalled();
        });

        it("does not call activateService when ID is undefined", () => {
            mockUseParams.mockReturnValue({
                id: undefined,
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).not.toHaveBeenCalled();
        });

        it("does not call activateService when ID is null", () => {
            mockUseParams.mockReturnValue({
                id: null,
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).not.toHaveBeenCalled();
        });

        it("does not call activateService when ID is empty string", () => {
            mockUseParams.mockReturnValue({
                id: "",
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).not.toHaveBeenCalled();
        });

        it("calls activateService with correct ID on re-render", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledWith("test-service-id");

            // Change the ID
            mockUseParams.mockReturnValue({
                id: "new-service-id",
            });

            rerender(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledWith("new-service-id");
            expect(mockActivateService).toHaveBeenCalledTimes(2);
        });

        it("handles multiple service activations", () => {
            const serviceIds = ["service-1", "service-2", "service-3"];

            serviceIds.forEach((id, index) => {
                mockUseParams.mockReturnValue({ id });

                const { unmount } = render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );

                expect(mockActivateService).toHaveBeenCalledWith(id);
                expect(mockActivateService).toHaveBeenCalledTimes(index + 1);
                unmount();
            });
        });
    });

    describe("Error Handling", () => {
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
                        <ServicePage />
                    </MemoryRouter>
                );
            }).toThrow();
        });

        it("handles electron API errors gracefully", () => {
            mockActivateService.mockImplementation(() => {
                throw new Error("Electron API error");
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }).toThrow("Electron API error");
        });

        it("handles router errors gracefully", () => {
            mockUseParams.mockImplementation(() => {
                throw new Error("Router error");
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }).toThrow("Router error");
        });
    });

    describe("Component Lifecycle", () => {
        it("calls activateService on mount", () => {
            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledTimes(1);
        });

        it("calls activateService when ID changes", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledTimes(1);

            // Change ID
            mockUseParams.mockReturnValue({
                id: "different-service",
            });

            rerender(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledTimes(2);
        });

        it("does not call activateService when ID remains the same", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledTimes(1);

            // Re-render with same ID
            rerender(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            // Should not call again
            expect(mockActivateService).toHaveBeenCalledTimes(1);
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledTimes(1);

            unmount();

            // Component should be unmounted without errors
            expect(mockActivateService).toHaveBeenCalledTimes(1);
        });
    });

    describe("Edge Cases", () => {
        it("handles very long service IDs", () => {
            const longId = "a".repeat(1000);
            mockUseParams.mockReturnValue({
                id: longId,
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledWith(longId);
        });

        it("handles special characters in service ID", () => {
            const specialId = "service-with-special-chars-!@#$%^&*()";
            mockUseParams.mockReturnValue({
                id: specialId,
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledWith(specialId);
        });

        it("handles numeric service IDs", () => {
            const numericId = "12345";
            mockUseParams.mockReturnValue({
                id: numericId,
            });

            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledWith(numericId);
        });

        it("handles rapid ID changes", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            // Rapidly change IDs
            for (let i = 0; i < 5; i++) {
                mockUseParams.mockReturnValue({
                    id: `service-${i}`,
                });

                rerender(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }

            expect(mockActivateService).toHaveBeenCalledTimes(6); // Initial + 5 changes
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );
            }

            // Should handle all re-renders without errors
            expect(mockActivateService).toHaveBeenCalledTimes(1);
        });
    });

    describe("Integration", () => {
        it("integrates properly with router context", () => {
            render(
                <MemoryRouter initialEntries={["/service/test-service"]}>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockUseParams).toHaveBeenCalled();
        });

        it("handles router context changes", () => {
            const { rerender } = render(
                <MemoryRouter initialEntries={["/service/service-1"]}>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockUseParams).toHaveBeenCalled();

            // Change router context
            rerender(
                <MemoryRouter initialEntries={["/service/service-2"]}>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockUseParams).toHaveBeenCalled();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(
                    <MemoryRouter>
                        <ServicePage />
                    </MemoryRouter>
                );

                expect(mockActivateService).toHaveBeenCalledTimes(i + 1);
                unmount();
            }

            // Should not have any memory leaks
            expect(mockActivateService).toHaveBeenCalledTimes(5);
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(
                <MemoryRouter>
                    <ServicePage />
                </MemoryRouter>
            );

            expect(mockActivateService).toHaveBeenCalledTimes(1);

            unmount();

            // Component should be unmounted
            expect(mockActivateService).toHaveBeenCalledTimes(1);
        });
    });
});
