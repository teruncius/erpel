import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Services } from "./services";

// Mock the store
const mockUseStore = vi.fn();
vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Mock react-router
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        NavLink: ({ children, to, title, className }: any) => (
            <a href={to} title={title} className={className} data-testid="service-link">
                {children}
            </a>
        ),
    };
});

// Mock ServiceIcon component
vi.mock("../settings/service-icon", () => ({
    ServiceIcon: ({ icon, name, size }: { icon: string; name: string; size: number }) => (
        <div data-testid="service-icon" data-icon={icon} data-name={name} data-size={size}>
            {name}
        </div>
    ),
}));

// Remove styled-components mocking to allow actual styled components to render

// Mock theme
vi.mock("../theme", () => ({
    SoftFrostedEffectStyle: "soft-frosted-effect-style",
}));

describe("Services", () => {
    const mockServices = [
        {
            id: "service-1",
            name: "Service 1",
            icon: "icon1.png",
            template: {
                name: { default: "Default Service 1" },
                icon: { default: "default-icon1.png" },
            },
        },
        {
            id: "service-2",
            name: "Service 2",
            icon: "icon2.png",
            template: {
                name: { default: "Default Service 2" },
                icon: { default: "default-icon2.png" },
            },
        },
        {
            id: "service-3",
            name: null,
            icon: null,
            template: {
                name: { default: "Default Service 3" },
                icon: { default: "default-icon3.png" },
            },
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();

        // Default store mock
        mockUseStore.mockReturnValue({
            services: mockServices,
            isOpen: true,
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders services when available", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(screen.getAllByTestId("service-link")).toHaveLength(3);
            expect(screen.getAllByTestId("service-icon")).toHaveLength(3);
        });

        it("renders nothing when no services", () => {
            mockUseStore.mockReturnValue({
                services: [],
                isOpen: true,
            });

            const { container } = render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(container.firstChild).toBeNull();
        });

        it("renders consistently", () => {
            const { container: container1 } = render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            const { container: container2 } = render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(container1.innerHTML).toBe(container2.innerHTML);
        });
    });

    describe("Store Integration", () => {
        it("uses services from store", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("handles services changes", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(mockUseStore).toHaveBeenCalled();

            // Change services
            mockUseStore.mockReturnValue({
                services: [mockServices[0]],
                isOpen: true,
            });

            rerender(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("handles undefined services", () => {
            mockUseStore.mockReturnValue({
                services: undefined,
                isOpen: true,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Services />
                    </MemoryRouter>
                );
            }).toThrow();
        });

        it("handles null services", () => {
            mockUseStore.mockReturnValue({
                services: null,
                isOpen: true,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Services />
                    </MemoryRouter>
                );
            }).toThrow();
        });
    });

    describe("Service Rendering", () => {
        it("renders service with custom name and icon", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            const serviceLinks = screen.getAllByTestId("service-link");
            const serviceIcons = screen.getAllByTestId("service-icon");

            expect(serviceLinks[0]).toHaveAttribute("title", "Service 1");
            expect(serviceIcons[0]).toHaveAttribute("data-name", "Service 1");
            expect(serviceIcons[0]).toHaveAttribute("data-icon", "icon1.png");
        });

        it("renders service with default name and icon when custom are null", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            const serviceLinks = screen.getAllByTestId("service-link");
            const serviceIcons = screen.getAllByTestId("service-icon");

            expect(serviceLinks[2]).toHaveAttribute("title", "Default Service 3");
            expect(serviceIcons[2]).toHaveAttribute("data-name", "Default Service 3");
            expect(serviceIcons[2]).toHaveAttribute("data-icon", "default-icon3.png");
        });

        it("renders correct number of services", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(screen.getAllByTestId("service-link")).toHaveLength(3);
            expect(screen.getAllByTestId("service-icon")).toHaveLength(3);
        });

        it("renders services with correct href", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            const serviceLinks = screen.getAllByTestId("service-link");

            expect(serviceLinks[0]).toHaveAttribute("href", "/service/service-1");
            expect(serviceLinks[1]).toHaveAttribute("href", "/service/service-2");
            expect(serviceLinks[2]).toHaveAttribute("href", "/service/service-3");
        });
    });

    describe("Service Icon Rendering", () => {
        it("renders service icons with correct size", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            const serviceIcons = screen.getAllByTestId("service-icon");

            serviceIcons.forEach((icon) => {
                expect(icon).toHaveAttribute("data-size", "32");
            });
        });

        it("renders service icons with correct names", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            const serviceIcons = screen.getAllByTestId("service-icon");

            expect(serviceIcons[0]).toHaveAttribute("data-name", "Service 1");
            expect(serviceIcons[1]).toHaveAttribute("data-name", "Service 2");
            expect(serviceIcons[2]).toHaveAttribute("data-name", "Default Service 3");
        });

        it("renders service icons with correct icons", () => {
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            const serviceIcons = screen.getAllByTestId("service-icon");

            expect(serviceIcons[0]).toHaveAttribute("data-icon", "icon1.png");
            expect(serviceIcons[1]).toHaveAttribute("data-icon", "icon2.png");
            expect(serviceIcons[2]).toHaveAttribute("data-icon", "default-icon3.png");
        });
    });

    describe("Edge Cases", () => {
        it("handles empty services array", () => {
            mockUseStore.mockReturnValue({
                services: [],
                isOpen: true,
            });

            const { container } = render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(container.firstChild).toBeNull();
        });

        it("handles single service", () => {
            mockUseStore.mockReturnValue({
                services: [mockServices[0]],
                isOpen: true,
            });

            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(screen.getAllByTestId("service-link")).toHaveLength(1);
            expect(screen.getAllByTestId("service-icon")).toHaveLength(1);
        });

        it("handles many services", () => {
            const manyServices = Array.from({ length: 20 }, (_, i) => ({
                id: `service-${i}`,
                name: `Service ${i}`,
                icon: `icon${i}.png`,
                template: {
                    name: { default: `Default Service ${i}` },
                    icon: { default: `default-icon${i}.png` },
                },
            }));

            mockUseStore.mockReturnValue({
                services: manyServices,
                isOpen: true,
            });

            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(screen.getAllByTestId("service-link")).toHaveLength(20);
            expect(screen.getAllByTestId("service-icon")).toHaveLength(20);
        });

        it("handles services with missing template", () => {
            const serviceWithMissingTemplate = {
                id: "service-missing-template",
                name: null,
                icon: null,
                template: null,
            };

            mockUseStore.mockReturnValue({
                services: [serviceWithMissingTemplate],
                isOpen: true,
            });

            // The component should throw an error when trying to access template.name.default on null
            expect(() => {
                render(
                    <MemoryRouter>
                        <Services />
                    </MemoryRouter>
                );
            }).toThrow();
        });

        it("handles services with missing template properties", () => {
            const serviceWithIncompleteTemplate = {
                id: "service-incomplete-template",
                name: null,
                icon: null,
                template: {
                    name: null,
                    icon: null,
                },
            };

            mockUseStore.mockReturnValue({
                services: [serviceWithIncompleteTemplate],
                isOpen: true,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Services />
                    </MemoryRouter>
                );
            }).toThrow();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(
                    <MemoryRouter>
                        <Services />
                    </MemoryRouter>
                );
            }

            expect(screen.getAllByTestId("service-link")).toHaveLength(3);
        });

        it("handles large number of services efficiently", () => {
            const largeServiceList = Array.from({ length: 100 }, (_, i) => ({
                id: `service-${i}`,
                name: `Service ${i}`,
                icon: `icon${i}.png`,
                template: {
                    name: { default: `Default Service ${i}` },
                    icon: { default: `default-icon${i}.png` },
                },
            }));

            mockUseStore.mockReturnValue({
                services: largeServiceList,
                isOpen: true,
            });

            const startTime = performance.now();
            render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(500);
            expect(screen.getAllByTestId("service-link")).toHaveLength(100);
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(
                <MemoryRouter>
                    <Services />
                </MemoryRouter>
            );

            expect(screen.getAllByTestId("service-link")).toHaveLength(3);

            unmount();

            // Component should be unmounted
            expect(screen.queryAllByTestId("service-link")).toHaveLength(0);
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(
                    <MemoryRouter>
                        <Services />
                    </MemoryRouter>
                );

                expect(screen.getAllByTestId("service-link")).toHaveLength(3);
                unmount();
            }

            // Should not have any memory leaks
            expect(screen.queryAllByTestId("service-link")).toHaveLength(0);
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
                        <Services />
                    </MemoryRouter>
                );
            }).toThrow("Store error");
        });

        it("handles service rendering errors gracefully", () => {
            // This test verifies that the component can handle malformed service data
            // by testing with a service that has invalid template structure
            const invalidService = {
                id: "invalid-service",
                name: null,
                icon: null,
                template: {
                    name: null, // This should cause an error when accessing .default
                    icon: null,
                },
            };

            mockUseStore.mockReturnValue({
                services: [invalidService],
                isOpen: true,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <Services />
                    </MemoryRouter>
                );
            }).toThrow();
        });
    });
});
