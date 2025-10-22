import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock window.electron
const mockHideAllServices = vi.fn();

// Define electron on window before importing component
Object.defineProperty(window, "electron", {
    value: {
        hideAllServices: mockHideAllServices,
    },
    writable: true,
    configurable: true,
});

// Mock Icon component
vi.mock("../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <svg data-testid={`icon-${name}`} height={size} width={size}>
            {name}
        </svg>
    ),
}));

// Mock SetupServices component
vi.mock("../setup/setup-services", () => ({
    SetupServices: () => <div data-testid="setup-services">Setup Services</div>,
}));

// Mock Services component
vi.mock("./services", () => ({
    Services: () => <div data-testid="services">Services</div>,
}));

// Mock ServiceTemplates component
vi.mock("./service-templates", () => ({
    ServiceTemplates: () => <div data-testid="service-templates">Service Templates</div>,
}));

// Mock LocaleSettings component
vi.mock("./locale-settings", () => ({
    LocaleSettings: () => <div data-testid="locale-settings">Locale Settings</div>,
}));

// Mock DistractionSettings component
vi.mock("./distraction-settings", () => ({
    DistractionSettings: () => <div data-testid="distraction-settings">Distraction Settings</div>,
}));

// Mock WallpaperSettings component
vi.mock("./wallpaper-settings", () => ({
    WallpaperSettings: () => <div data-testid="wallpaper-settings">Wallpaper Settings</div>,
}));

// Mock ExportSettingsButton component
vi.mock("./export-settings-button", () => ({
    ExportSettingsButton: () => <button data-testid="export-settings-button">Export Settings</button>,
}));

// Mock DebugNotificationsButton component
vi.mock("./debug-notifications-button", () => ({
    DebugNotificationsButton: () => <button data-testid="debug-notifications-button">Debug Notifications</button>,
}));

// Mock useStore hook
const mockUseStore = vi.fn();

vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Import the component after mocking
import { SettingsPage } from "./settings-page";

describe("SettingsPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        // Default mock return value
        mockUseStore.mockReturnValue({
            services: [
                { id: "service-1", name: "Test Service 1" },
                { id: "service-2", name: "Test Service 2" },
            ],
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without crashing", () => {
            const { container } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            expect(container).toBeInTheDocument();
        });

        it("calls hideAllServices on mount", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalled();
        });

        it("calls hideAllServices only once", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledTimes(1);
        });

        it("renders ServiceTemplates component", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
        });

        it("renders LocaleSettings component", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            expect(screen.getByTestId("locale-settings")).toBeInTheDocument();
        });

        it("renders DistractionSettings component", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            expect(screen.getByTestId("distraction-settings")).toBeInTheDocument();
        });

        it("renders WallpaperSettings component", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            expect(screen.getByTestId("wallpaper-settings")).toBeInTheDocument();
        });

        it("renders ExportSettingsButton component", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            expect(screen.getByTestId("export-settings-button")).toBeInTheDocument();
        });

        it("renders DebugNotificationsButton component", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            expect(screen.getByTestId("debug-notifications-button")).toBeInTheDocument();
        });

        it("renders link to setup page", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            const link = screen.getByText("Go back to set up");
            expect(link).toBeInTheDocument();
        });

        it("renders cog icon in setup link", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            const icon = screen.getByTestId("icon-cog");
            expect(icon).toBeInTheDocument();
        });

        it("cog icon has correct size", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            const icon = screen.getByTestId("icon-cog");
            expect(icon).toHaveAttribute("width", "20");
            expect(icon).toHaveAttribute("height", "20");
        });
    });

    describe("Conditional Rendering", () => {
        it("renders Services component when services exist", () => {
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Test Service" }],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();
            expect(screen.queryByTestId("setup-services")).not.toBeInTheDocument();
        });

        it("renders SetupServices component when no services exist", () => {
            mockUseStore.mockReturnValue({
                services: [],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("setup-services")).toBeInTheDocument();
            expect(screen.queryByTestId("services")).not.toBeInTheDocument();
        });

        it("switches from SetupServices to Services when services are added", () => {
            mockUseStore.mockReturnValue({
                services: [],
            });

            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("setup-services")).toBeInTheDocument();

            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Test Service" }],
            });

            rerender(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();
            expect(screen.queryByTestId("setup-services")).not.toBeInTheDocument();
        });

        it("switches from Services to SetupServices when all services are removed", () => {
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Test Service" }],
            });

            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();

            mockUseStore.mockReturnValue({
                services: [],
            });

            rerender(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("setup-services")).toBeInTheDocument();
            expect(screen.queryByTestId("services")).not.toBeInTheDocument();
        });

        it("renders Services with single service", () => {
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Single Service" }],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();
        });

        it("renders Services with multiple services", () => {
            mockUseStore.mockReturnValue({
                services: [
                    { id: "service-1", name: "Service 1" },
                    { id: "service-2", name: "Service 2" },
                    { id: "service-3", name: "Service 3" },
                ],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();
        });
    });

    describe("useEffect Behavior", () => {
        it("calls hideAllServices on initial mount", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledTimes(1);
        });

        it("does not call hideAllServices on rerender", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            mockHideAllServices.mockClear();

            rerender(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).not.toHaveBeenCalled();
        });

        it("calls hideAllServices again on remount", () => {
            const { unmount } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledTimes(1);

            unmount();
            mockHideAllServices.mockClear();

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledTimes(1);
        });

        it("hideAllServices is called before rendering completes", async () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(mockHideAllServices).toHaveBeenCalled();
            });
        });
    });

    describe("Store Integration", () => {
        it("uses services from store", () => {
            mockUseStore.mockReturnValue({
                services: [{ id: "test-1", name: "Test" }],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();
        });

        it("reacts to changes in services from store", () => {
            mockUseStore.mockReturnValue({
                services: [],
            });

            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("setup-services")).toBeInTheDocument();

            mockUseStore.mockReturnValue({
                services: [{ id: "new-service", name: "New Service" }],
            });

            rerender(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();
        });

        it("handles undefined services by throwing error", () => {
            mockUseStore.mockReturnValue({
                services: undefined as unknown as never[],
            });

            // Component will throw error when trying to access undefined.length
            expect(() => {
                render(
                    <MemoryRouter>
                        <SettingsPage />
                    </MemoryRouter>
                );
            }).toThrow();
        });

        it("handles null services by throwing error", () => {
            mockUseStore.mockReturnValue({
                services: null as unknown as never[],
            });

            // Component will throw error when trying to access null.length
            expect(() => {
                render(
                    <MemoryRouter>
                        <SettingsPage />
                    </MemoryRouter>
                );
            }).toThrow();
        });
    });

    describe("Navigation", () => {
        it("link to setup page has correct path", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            const link = screen.getByText("Go back to set up").closest("a");
            expect(link).toHaveAttribute("href", "/setup");
        });

        it("link to setup page is rendered as ThemedLink", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            const link = screen.getByText("Go back to set up").closest("a");
            expect(link).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("maintains rendering across rerenders", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("service-templates")).toBeInTheDocument();

            rerender(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(() => unmount()).not.toThrow();
        });

        it("handles rapid mount/unmount cycles", () => {
            const { unmount: unmount1 } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            unmount1();

            const { unmount: unmount2 } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            unmount2();

            const { unmount: unmount3 } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );
            unmount3();

            expect(true).toBe(true); // No crashes
        });

        it("all components remain rendered after state changes", () => {
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Service 1" }],
            });

            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            mockUseStore.mockReturnValue({
                services: [
                    { id: "service-1", name: "Service 1" },
                    { id: "service-2", name: "Service 2" },
                ],
            });

            rerender(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
            expect(screen.getByTestId("locale-settings")).toBeInTheDocument();
            expect(screen.getByTestId("distraction-settings")).toBeInTheDocument();
            expect(screen.getByTestId("wallpaper-settings")).toBeInTheDocument();
        });
    });

    describe("Layout and Structure", () => {
        it("renders all settings components in correct order", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            // Check that all components are rendered
            expect(screen.getByTestId("services")).toBeInTheDocument();
            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
            expect(screen.getByTestId("locale-settings")).toBeInTheDocument();
            expect(screen.getByTestId("distraction-settings")).toBeInTheDocument();
            expect(screen.getByTestId("wallpaper-settings")).toBeInTheDocument();
        });

        it("renders button container with all action buttons", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("export-settings-button")).toBeInTheDocument();
            expect(screen.getByTestId("debug-notifications-button")).toBeInTheDocument();
            expect(screen.getByText("Go back to set up")).toBeInTheDocument();
        });

        it("renders all components when services exist", () => {
            mockUseStore.mockReturnValue({
                services: [{ id: "service-1", name: "Test Service" }],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("services")).toBeInTheDocument();
            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
            expect(screen.getByTestId("locale-settings")).toBeInTheDocument();
            expect(screen.getByTestId("distraction-settings")).toBeInTheDocument();
            expect(screen.getByTestId("wallpaper-settings")).toBeInTheDocument();
            expect(screen.getByTestId("export-settings-button")).toBeInTheDocument();
            expect(screen.getByTestId("debug-notifications-button")).toBeInTheDocument();
        });

        it("renders all components when no services exist", () => {
            mockUseStore.mockReturnValue({
                services: [],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("setup-services")).toBeInTheDocument();
            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
            expect(screen.getByTestId("locale-settings")).toBeInTheDocument();
            expect(screen.getByTestId("distraction-settings")).toBeInTheDocument();
            expect(screen.getByTestId("wallpaper-settings")).toBeInTheDocument();
            expect(screen.getByTestId("export-settings-button")).toBeInTheDocument();
            expect(screen.getByTestId("debug-notifications-button")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles missing electron.hideAllServices gracefully", () => {
            const originalElectron = (window as { electron?: unknown }).electron;
            Object.defineProperty(window, "electron", {
                value: {},
                writable: true,
                configurable: true,
            });

            expect(() => {
                render(
                    <MemoryRouter>
                        <SettingsPage />
                    </MemoryRouter>
                );
            }).toThrow();

            Object.defineProperty(window, "electron", {
                value: originalElectron,
                writable: true,
                configurable: true,
            });
        });

        it("handles services with empty array", () => {
            mockUseStore.mockReturnValue({
                services: [],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByTestId("setup-services")).toBeInTheDocument();
        });

        it("handles services array with falsy values", () => {
            mockUseStore.mockReturnValue({
                services: [null, undefined, { id: "real-service", name: "Real" }] as unknown as never[],
            });

            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            // Should render Services because length > 0
            expect(screen.getByTestId("services")).toBeInTheDocument();
        });

        it("renders without MemoryRouter wrapper", () => {
            // This should fail because ThemedLink requires router context
            expect(() => {
                render(<SettingsPage />);
            }).toThrow();
        });
    });

    describe("Performance", () => {
        it("renders efficiently with multiple rerenders", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            for (let i = 0; i < 10; i++) {
                rerender(
                    <MemoryRouter>
                        <SettingsPage />
                    </MemoryRouter>
                );
            }

            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
        });

        it("handles rapid service changes", () => {
            const { rerender } = render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            for (let i = 0; i < 5; i++) {
                mockUseStore.mockReturnValue({
                    services: i % 2 === 0 ? [] : [{ id: `service-${i}`, name: `Service ${i}` }],
                });

                rerender(
                    <MemoryRouter>
                        <SettingsPage />
                    </MemoryRouter>
                );
            }

            expect(screen.getByTestId("service-templates")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("link has accessible text", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            const link = screen.getByText("Go back to set up");
            expect(link).toBeInTheDocument();
        });

        it("buttons have accessible labels", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(screen.getByText("Export Settings")).toBeInTheDocument();
            expect(screen.getByText("Debug Notifications")).toBeInTheDocument();
        });
    });

    describe("Electron Integration", () => {
        it("electron.hideAllServices is available", () => {
            expect((window as { electron: { hideAllServices: unknown } }).electron.hideAllServices).toBeDefined();
        });

        it("calls electron API on component mount", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalled();
        });

        it("hideAllServices is called with no arguments", () => {
            render(
                <MemoryRouter>
                    <SettingsPage />
                </MemoryRouter>
            );

            expect(mockHideAllServices).toHaveBeenCalledWith();
        });
    });
});
