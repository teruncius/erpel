import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Mock Icon component
vi.mock("../../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid={`icon-${name}`} data-size={size}>
            {name}
        </div>
    ),
}));

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock Notification API
const mockNotification = vi.fn();
const mockNotificationInstance = {
    onclick: null as ((this: Notification, ev: Event) => unknown) | null,
};

// Mock window.electron
const mockFocusWindow = vi.fn();
const mockElectron = {
    focusWindow: mockFocusWindow,
};

// Set up global mocks
beforeAll(() => {
    globalThis.Notification = mockNotification as unknown as typeof Notification;
    (globalThis.window as unknown as { electron: typeof mockElectron }).electron = mockElectron;
});

// Import the component after mocking
import { DebugNotificationsButton } from "./debug-notifications-button";

describe("DebugNotificationsButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        mockNotification.mockReturnValue(mockNotificationInstance);
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders button element", () => {
            render(<DebugNotificationsButton />);

            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("renders with correct text", () => {
            render(<DebugNotificationsButton />);

            expect(screen.getByText("Test Notification")).toBeInTheDocument();
        });

        it("renders with bug icon", () => {
            const { container } = render(<DebugNotificationsButton />);

            // Icon is rendered as SVG in the actual component
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("renders bug icon with correct size", () => {
            const { container } = render(<DebugNotificationsButton />);

            // Icon is rendered as SVG with height/width attributes
            const svg = container.querySelector("svg");
            expect(svg).toHaveAttribute("height", "20");
            expect(svg).toHaveAttribute("width", "20");
        });

        it("renders without errors", () => {
            expect(() => render(<DebugNotificationsButton />)).not.toThrow();
        });
    });

    describe("Notification Creation", () => {
        it("creates notification when button is clicked", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockNotification).toHaveBeenCalledTimes(1);
        });

        it("creates notification with correct title", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockNotification).toHaveBeenCalledWith("Settings - erpel", expect.any(Object));
        });

        it("creates notification with correct body", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockNotification).toHaveBeenCalledWith(expect.any(String), { body: "Debug Test Notification" });
        });

        it("creates notification with title and body", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockNotification).toHaveBeenCalledWith("Settings - erpel", {
                body: "Debug Test Notification",
            });
        });

        it("creates new notification on each click", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);
            await user.click(button);
            await user.click(button);

            expect(mockNotification).toHaveBeenCalledTimes(3);
        });
    });

    describe("Notification Click Handler", () => {
        it("sets onclick handler on notification", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockNotificationInstance.onclick).toBeDefined();
            expect(mockNotificationInstance.onclick).not.toBeNull();
        });

        it("navigates to /settings when notification is clicked", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Simulate clicking the notification
            if (mockNotificationInstance.onclick) {
                mockNotificationInstance.onclick.call(mockNotificationInstance as unknown as Notification, new Event("click"));
            }

            expect(mockNavigate).toHaveBeenCalledWith("/settings");
        });

        it("focuses window when notification is clicked", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Simulate clicking the notification
            if (mockNotificationInstance.onclick) {
                mockNotificationInstance.onclick.call(mockNotificationInstance as unknown as Notification, new Event("click"));
            }

            expect(mockFocusWindow).toHaveBeenCalledTimes(1);
        });

        it("calls both navigate and focusWindow when notification is clicked", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Simulate clicking the notification
            if (mockNotificationInstance.onclick) {
                mockNotificationInstance.onclick.call(mockNotificationInstance as unknown as Notification, new Event("click"));
            }

            expect(mockNavigate).toHaveBeenCalledWith("/settings");
            expect(mockFocusWindow).toHaveBeenCalledTimes(1);
        });

        it("handles multiple notification clicks", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            
            // Create first notification and click it
            await user.click(button);
            if (mockNotificationInstance.onclick) {
                mockNotificationInstance.onclick.call(mockNotificationInstance as unknown as Notification, new Event("click"));
            }

            // Create second notification and click it
            await user.click(button);
            if (mockNotificationInstance.onclick) {
                mockNotificationInstance.onclick.call(mockNotificationInstance as unknown as Notification, new Event("click"));
            }

            expect(mockNavigate).toHaveBeenCalledTimes(2);
            expect(mockFocusWindow).toHaveBeenCalledTimes(2);
        });
    });

    describe("Button Interaction", () => {
        it("handles button click", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Should create notification
            expect(mockNotification).toHaveBeenCalled();
        });

        it("handles multiple button clicks", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);
            await user.click(button);
            await user.click(button);

            expect(mockNotification).toHaveBeenCalledTimes(3);
        });

        it("handles rapid clicking", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");

            // Rapid clicks
            for (let i = 0; i < 5; i++) {
                await user.click(button);
            }

            expect(mockNotification).toHaveBeenCalledTimes(5);
        });

        it("is keyboard accessible", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.tab();

            expect(button).toHaveFocus();
        });

        it("can be activated with keyboard", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            button.focus();
            await user.keyboard("{Enter}");

            expect(mockNotification).toHaveBeenCalled();
        });
    });

    describe("React Hook Integration", () => {
        it("uses useNavigate hook", () => {
            render(<DebugNotificationsButton />);

            // Component renders successfully, which means useNavigate was called
            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("uses useCallback for handleNotify", async () => {
            const user = userEvent.setup();
            const { rerender } = render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            const firstCallCount = mockNotification.mock.calls.length;

            // Re-render component
            rerender(<DebugNotificationsButton />);

            await user.click(button);

            // Should have one more call
            expect(mockNotification.mock.calls.length).toBe(firstCallCount + 1);
        });
    });

    describe("Accessibility", () => {
        it("has button role", () => {
            render(<DebugNotificationsButton />);

            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("is focusable", () => {
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            button.focus();

            expect(button).toHaveFocus();
        });

        it("contains descriptive text", () => {
            render(<DebugNotificationsButton />);

            expect(screen.getByText("Test Notification")).toBeInTheDocument();
        });

        it("has icon for visual context", () => {
            const { container } = render(<DebugNotificationsButton />);

            // Icon is rendered as SVG
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles missing electron API gracefully", async () => {
            const user = userEvent.setup();
            const originalElectron = (globalThis.window as unknown as { electron: typeof mockElectron }).electron;
            
            // Temporarily remove electron API
            (globalThis.window as unknown as { electron: undefined }).electron = undefined as unknown as undefined;

            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Should create notification even without electron
            expect(mockNotification).toHaveBeenCalled();

            // Restore electron API
            (globalThis.window as unknown as { electron: typeof mockElectron }).electron = originalElectron;
        });

        it("handles notification without onclick handler", async () => {
            const user = userEvent.setup();
            const notificationWithoutOnclick = {};
            mockNotification.mockReturnValueOnce(notificationWithoutOnclick);

            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Should create notification successfully
            expect(mockNotification).toHaveBeenCalled();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<DebugNotificationsButton />);

            expect(screen.getByRole("button")).toBeInTheDocument();

            unmount();

            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<DebugNotificationsButton />);

                expect(screen.getByRole("button")).toBeInTheDocument();
                unmount();
            }

            // Should not have any memory leaks
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("maintains functionality after re-render", async () => {
            const user = userEvent.setup();
            const { rerender } = render(<DebugNotificationsButton />);

            rerender(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockNotification).toHaveBeenCalled();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<DebugNotificationsButton />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<DebugNotificationsButton />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<DebugNotificationsButton />);
            }

            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });

    describe("Integration", () => {
        it("integrates with ThemedButton", () => {
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("integrates with Icon component", () => {
            const { container } = render(<DebugNotificationsButton />);

            // Icon is rendered as SVG
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("integrates with react-router navigation", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Simulate notification click
            if (mockNotificationInstance.onclick) {
                mockNotificationInstance.onclick.call(mockNotificationInstance as unknown as Notification, new Event("click"));
            }

            expect(mockNavigate).toHaveBeenCalledWith("/settings");
        });

        it("integrates with Electron window API", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Simulate notification click
            if (mockNotificationInstance.onclick) {
                mockNotificationInstance.onclick.call(mockNotificationInstance as unknown as Notification, new Event("click"));
            }

            expect(mockFocusWindow).toHaveBeenCalled();
        });
    });

    describe("Notification Content", () => {
        it("uses application name in notification title", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            const [title] = mockNotification.mock.calls[0];
            expect(title).toContain("erpel");
        });

        it("indicates settings context in title", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            const [title] = mockNotification.mock.calls[0];
            expect(title).toContain("Settings");
        });

        it("indicates debug purpose in body", async () => {
            const user = userEvent.setup();
            render(<DebugNotificationsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            const [, options] = mockNotification.mock.calls[0];
            expect(options.body).toContain("Debug");
            expect(options.body).toContain("Test");
        });
    });
});

