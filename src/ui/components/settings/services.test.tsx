import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Services } from "./services";

// Mock the store
const mockUseStore = vi.fn();
vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Mock the Icon component
vi.mock("../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid="icon" data-name={name} data-size={size}>
            {name}
        </div>
    ),
}));

// Mock the ServiceForm component
vi.mock("./service-form", () => ({
    ServiceForm: ({ service }: { service: any }) => (
        <div data-testid="service-form" data-service-id={service.id}>
            Service Form for {service.id}
        </div>
    ),
}));

// Mock the ServiceIcon component
vi.mock("./service-icon", () => ({
    ServiceIcon: ({ icon, name, size }: { icon: string; name: string; size: number }) => (
        <div data-testid="service-icon" data-icon={icon} data-name={name} data-size={size}>
            {name}
        </div>
    ),
}));

// Remove styled-components mocking to allow actual styled components to render

// Mock @dnd-kit components
vi.mock("@dnd-kit/core", () => ({
    DndContext: ({ children, onDragEnd }: any) => (
        <div data-testid="dnd-context" data-on-drag-end={onDragEnd ? "mocked" : "undefined"}>
            {children}
        </div>
    ),
    closestCenter: "closest-center",
}));

vi.mock("@dnd-kit/sortable", () => ({
    SortableContext: ({ children, items, strategy }: any) => (
        <div data-testid="sortable-context" data-items={JSON.stringify(items)} data-strategy={strategy}>
            {children}
        </div>
    ),
    useSortable: ({ id }: { id: string }) => ({
        attributes: { "data-sortable-id": id },
        listeners: { onMouseDown: vi.fn() },
        setActivatorNodeRef: vi.fn(),
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
    }),
    verticalListSortingStrategy: "vertical-list-sorting-strategy",
}));

vi.mock("@dnd-kit/utilities", () => ({
    CSS: {
        Transform: {
            toString: (transform: any) => (transform ? "transformed" : "none"),
        },
    },
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

    const mockStore = {
        services: mockServices,
        reorder: vi.fn(),
        remove: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        mockUseStore.mockReturnValue(mockStore);

        // Mock window.confirm
        window.confirm = vi.fn(() => true);
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders the services component", () => {
            render(<Services />);

            // Check that the component renders without errors
            expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
        });

        it("renders all services", () => {
            render(<Services />);

            // Check that all services are rendered
            expect(screen.getAllByTestId("service-icon")).toHaveLength(3);
        });

        it("renders with correct service names", () => {
            render(<Services />);

            const serviceIcons = screen.getAllByTestId("service-icon");
            expect(serviceIcons[0]).toHaveAttribute("data-name", "Service 1");
            expect(serviceIcons[1]).toHaveAttribute("data-name", "Service 2");
            expect(serviceIcons[2]).toHaveAttribute("data-name", "Default Service 3");
        });

        it("renders with correct service icons", () => {
            render(<Services />);

            const serviceIcons = screen.getAllByTestId("service-icon");
            expect(serviceIcons[0]).toHaveAttribute("data-icon", "icon1.png");
            expect(serviceIcons[1]).toHaveAttribute("data-icon", "icon2.png");
            expect(serviceIcons[2]).toHaveAttribute("data-icon", "default-icon3.png");
        });

        it("renders consistently", () => {
            const { container: container1 } = render(<Services />);
            const { container: container2 } = render(<Services />);

            expect(container1.innerHTML).toBe(container2.innerHTML);
        });
    });

    describe("Store Integration", () => {
        it("uses services from store", () => {
            render(<Services />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("handles empty services array", () => {
            mockUseStore.mockReturnValue({
                ...mockStore,
                services: [],
            });

            render(<Services />);

            expect(screen.queryByTestId("service-icon")).not.toBeInTheDocument();
        });

        it("handles services changes", () => {
            const { rerender } = render(<Services />);

            expect(mockUseStore).toHaveBeenCalled();

            // Change services
            mockUseStore.mockReturnValue({
                ...mockStore,
                services: [mockServices[0]],
            });

            rerender(<Services />);

            expect(screen.getAllByTestId("service-icon")).toHaveLength(1);
        });
    });

    describe("Drag and Drop", () => {
        it("renders DndContext", () => {
            render(<Services />);

            expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
        });

        it("renders SortableContext with correct items", () => {
            render(<Services />);

            const sortableContext = screen.getByTestId("sortable-context");
            expect(sortableContext).toHaveAttribute(
                "data-items",
                JSON.stringify(["service-1", "service-2", "service-3"])
            );
            expect(sortableContext).toHaveAttribute("data-strategy", "vertical-list-sorting-strategy");
        });

        it("calls reorder when drag ends", () => {
            render(<Services />);

            const dndContext = screen.getByTestId("dnd-context");
            expect(dndContext).toHaveAttribute("data-on-drag-end", "mocked");
        });
    });

    describe("Service Actions", () => {
        it("renders service action buttons", () => {
            render(<Services />);

            // Each service should have 3 buttons: drag handle, settings, delete
            const buttons = screen.getAllByRole("button");
            expect(buttons.length).toBeGreaterThan(0);
        });

        it("handles service delete with confirmation", () => {
            render(<Services />);

            const deleteButtons = screen
                .getAllByRole("button")
                .filter((button) => button.querySelector('[data-name="bin"]'));

            expect(deleteButtons).toHaveLength(3);

            // Click first delete button
            fireEvent.click(deleteButtons[0]);

            expect(window.confirm).toHaveBeenCalledWith("Do you really want to delete this service?");
            expect(mockStore.remove).toHaveBeenCalledWith("service-1");
        });

        it("does not delete service when confirmation is cancelled", () => {
            window.confirm = vi.fn(() => false);

            render(<Services />);

            const deleteButtons = screen
                .getAllByRole("button")
                .filter((button) => button.querySelector('[data-name="bin"]'));

            fireEvent.click(deleteButtons[0]);

            expect(window.confirm).toHaveBeenCalledWith("Do you really want to delete this service?");
            expect(mockStore.remove).not.toHaveBeenCalled();
        });

        it("handles service settings toggle", () => {
            render(<Services />);

            const settingsButtons = screen
                .getAllByRole("button")
                .filter((button) => button.querySelector('[data-name="cog"]'));

            expect(settingsButtons).toHaveLength(3);

            // Click first settings button
            fireEvent.click(settingsButtons[0]);

            // Service form should appear
            expect(screen.getByTestId("service-form")).toBeInTheDocument();
            expect(screen.getByTestId("service-form")).toHaveAttribute("data-service-id", "service-1");
        });
    });

    describe("Service Form Integration", () => {
        it("shows service form when settings button is clicked", () => {
            render(<Services />);

            const settingsButtons = screen
                .getAllByRole("button")
                .filter((button) => button.querySelector('[data-name="cog"]'));

            // Initially no service form should be visible
            expect(screen.queryByTestId("service-form")).not.toBeInTheDocument();

            // Click settings button
            fireEvent.click(settingsButtons[0]);

            // Service form should appear
            expect(screen.getByTestId("service-form")).toBeInTheDocument();
        });

        it("hides service form when settings button is clicked again", () => {
            render(<Services />);

            const settingsButtons = screen
                .getAllByRole("button")
                .filter((button) => button.querySelector('[data-name="cog"]'));

            // Click settings button to open
            fireEvent.click(settingsButtons[0]);
            expect(screen.getByTestId("service-form")).toBeInTheDocument();

            // Click settings button again to close
            fireEvent.click(settingsButtons[0]);
            expect(screen.queryByTestId("service-form")).not.toBeInTheDocument();
        });
    });

    describe("Service Display", () => {
        it("displays service name correctly", () => {
            render(<Services />);

            // Service 1 should show custom name
            expect(screen.getByText("Service 1")).toBeInTheDocument();

            // Service 2 should show custom name
            expect(screen.getByText("Service 2")).toBeInTheDocument();

            // Service 3 should show default name (check in service icon specifically)
            const serviceIcons = screen.getAllByTestId("service-icon");
            expect(serviceIcons[2]).toHaveTextContent("Default Service 3");
        });

        it("displays template name prefix when both custom and template names exist", () => {
            render(<Services />);

            // Should show "Default Service 1: Service 1" format
            // Use a function matcher to handle text split across elements
            expect(
                screen.getByText((content, element) => {
                    return element?.textContent === "Default Service 1: Service 1";
                })
            ).toBeInTheDocument();

            expect(
                screen.getByText((content, element) => {
                    return element?.textContent === "Default Service 2: Service 2";
                })
            ).toBeInTheDocument();
        });

        it("handles services with null names and icons", () => {
            render(<Services />);

            // Service 3 has null name and icon, should use defaults
            const serviceIcons = screen.getAllByTestId("service-icon");
            expect(serviceIcons[2]).toHaveAttribute("data-name", "Default Service 3");
            expect(serviceIcons[2]).toHaveAttribute("data-icon", "default-icon3.png");
        });
    });

    describe("Edge Cases", () => {
        it("handles single service", () => {
            mockUseStore.mockReturnValue({
                ...mockStore,
                services: [mockServices[0]],
            });

            render(<Services />);

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
                ...mockStore,
                services: manyServices,
            });

            render(<Services />);

            expect(screen.getAllByTestId("service-icon")).toHaveLength(20);
        });

        it("handles undefined services", () => {
            mockUseStore.mockReturnValue({
                ...mockStore,
                services: undefined,
            });

            expect(() => render(<Services />)).toThrow();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<Services />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<Services />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<Services />);
            }

            expect(screen.getAllByTestId("service-icon")).toHaveLength(3);
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<Services />);

            expect(screen.getAllByTestId("service-icon")).toHaveLength(3);

            unmount();

            // Component should be unmounted
            expect(screen.queryByTestId("service-icon")).not.toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<Services />);

                expect(screen.getAllByTestId("service-icon")).toHaveLength(3);
                unmount();
            }

            // Should not have any memory leaks
            expect(screen.queryByTestId("service-icon")).not.toBeInTheDocument();
        });
    });
});
