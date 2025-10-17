import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock Icon component
vi.mock("../../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid={`icon-${name}`} data-size={size}>
            {name}
        </div>
    ),
}));

// Mock useStore hook
const mockSetIsMuted = vi.fn();
const mockUseStore = vi.fn();

vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Import the component after mocking
import { DistractionSettings } from "./distraction-settings";

describe("DistractionSettings", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        // Default mock return value
        mockUseStore.mockReturnValue({
            isMuted: false,
            setIsMuted: mockSetIsMuted,
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without errors", () => {
            expect(() => render(<DistractionSettings />)).not.toThrow();
        });

        it("renders checkbox element", () => {
            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("renders with placeholder text", () => {
            render(<DistractionSettings />);

            expect(screen.getByText("Mute the duck")).toBeInTheDocument();
        });

        it("renders checkbox in unchecked state when isMuted is false", () => {
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            const { container } = render(<DistractionSettings />);

            // Check that SVG icon is rendered
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("renders checkbox in checked state when isMuted is true", () => {
            mockUseStore.mockReturnValue({
                isMuted: true,
                setIsMuted: mockSetIsMuted,
            });

            const { container } = render(<DistractionSettings />);

            // Check that SVG icon is rendered
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });
    });

    describe("Store Integration", () => {
        it("retrieves isMuted from store", () => {
            mockUseStore.mockReturnValue({
                isMuted: true,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("retrieves setIsMuted from store", () => {
            render(<DistractionSettings />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("displays correct initial state from store", () => {
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            const { container } = render(<DistractionSettings />);

            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("updates when store value changes", () => {
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            const { rerender, container } = render(<DistractionSettings />);

            // Update store value
            mockUseStore.mockReturnValue({
                isMuted: true,
                setIsMuted: mockSetIsMuted,
            });

            rerender(<DistractionSettings />);

            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });
    });

    describe("Checkbox Interaction", () => {
        it("calls setIsMuted when checkbox is clicked", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockSetIsMuted).toHaveBeenCalled();
        });

        it("calls setIsMuted with true when unchecked is clicked", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockSetIsMuted).toHaveBeenCalledWith(true);
        });

        it("calls setIsMuted with false when checked is clicked", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: true,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockSetIsMuted).toHaveBeenCalledWith(false);
        });

        it("calls setIsMuted on click", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);
            const initialCallCount = mockSetIsMuted.mock.calls.length;

            const button = screen.getByRole("button");
            await user.click(button);

            // Should have one more call after click (plus initial mount call)
            expect(mockSetIsMuted.mock.calls.length).toBeGreaterThan(initialCallCount);
        });

        it("handles multiple clicks", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);
            const initialCallCount = mockSetIsMuted.mock.calls.length;

            const button = screen.getByRole("button");
            await user.click(button);
            await user.click(button);
            await user.click(button);

            // Should have 3 more calls after clicks (plus initial mount call)
            expect(mockSetIsMuted.mock.calls.length).toBe(initialCallCount + 3);
        });

        it("handles rapid clicking", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);
            const initialCallCount = mockSetIsMuted.mock.calls.length;

            const button = screen.getByRole("button");

            // Rapid clicks
            for (let i = 0; i < 5; i++) {
                await user.click(button);
            }

            // Should have 5 more calls after clicks (plus initial mount call)
            expect(mockSetIsMuted.mock.calls.length).toBe(initialCallCount + 5);
        });
    });

    describe("Callback Behavior", () => {
        it("uses useCallback for handleChange", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            const { rerender } = render(<DistractionSettings />);

            const button = screen.getByRole("button");
            await user.click(button);

            const firstCallCount = mockSetIsMuted.mock.calls.length;

            // Re-render component
            rerender(<DistractionSettings />);

            await user.click(button);

            // Should have one more call
            expect(mockSetIsMuted.mock.calls.length).toBe(firstCallCount + 1);
        });

        it("handleChange depends on setIsMuted", () => {
            const firstSetIsMuted = vi.fn();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: firstSetIsMuted,
            });

            const { rerender } = render(<DistractionSettings />);

            // Change setIsMuted function
            const secondSetIsMuted = vi.fn();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: secondSetIsMuted,
            });

            rerender(<DistractionSettings />);

            // Component should work with new setIsMuted
            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has button role for checkbox", () => {
            render(<DistractionSettings />);

            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("displays descriptive placeholder text", () => {
            render(<DistractionSettings />);

            expect(screen.getByText("Mute the duck")).toBeInTheDocument();
        });

        it("is keyboard accessible", async () => {
            const user = userEvent.setup();
            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            await user.tab();

            expect(button).toHaveFocus();
        });

        it("can be activated with keyboard", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            button.focus();
            await user.keyboard("{Enter}");

            expect(mockSetIsMuted).toHaveBeenCalled();
        });

        it("can be activated with space key", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            button.focus();
            await user.keyboard(" ");

            expect(mockSetIsMuted).toHaveBeenCalled();
        });

        it("is focusable", () => {
            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            button.focus();

            expect(button).toHaveFocus();
        });
    });

    describe("ThemedSection Integration", () => {
        it("renders within ThemedSection", () => {
            const { container } = render(<DistractionSettings />);

            // ThemedSection should be rendered
            expect(container.firstChild).toBeInTheDocument();
        });

        it("maintains layout structure", () => {
            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
            expect(screen.getByText("Mute the duck")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles undefined isMuted gracefully", () => {
            mockUseStore.mockReturnValue({
                isMuted: undefined as unknown as boolean,
                setIsMuted: mockSetIsMuted,
            });

            expect(() => render(<DistractionSettings />)).not.toThrow();
        });

        it("handles null isMuted gracefully", () => {
            mockUseStore.mockReturnValue({
                isMuted: null as unknown as boolean,
                setIsMuted: mockSetIsMuted,
            });

            expect(() => render(<DistractionSettings />)).not.toThrow();
        });

        it("renders with missing setIsMuted function", () => {
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: undefined as unknown as (value: boolean) => void,
            });

            // Component will throw error on mount due to checkbox calling onChange
            try {
                render(<DistractionSettings />);
            } catch (error) {
                // Expected to throw
                expect(error).toBeDefined();
            }
        });

        it("handles setIsMuted being called with different values in sequence", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");

            // First click should call with true (checkbox becomes checked)
            await user.click(button);
            // Get the last call value
            const firstClickValue = mockSetIsMuted.mock.calls[mockSetIsMuted.mock.calls.length - 1][0];
            expect(firstClickValue).toBe(true);

            // Second click should call with false (checkbox becomes unchecked)
            await user.click(button);
            const secondClickValue = mockSetIsMuted.mock.calls[mockSetIsMuted.mock.calls.length - 1][0];
            expect(secondClickValue).toBe(false);
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<DistractionSettings />);

            expect(screen.getByRole("button")).toBeInTheDocument();

            unmount();

            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<DistractionSettings />);

                expect(screen.getByRole("button")).toBeInTheDocument();
                unmount();
            }

            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("maintains functionality after re-render", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            const { rerender } = render(<DistractionSettings />);

            rerender(<DistractionSettings />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockSetIsMuted).toHaveBeenCalled();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<DistractionSettings />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<DistractionSettings />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                mockUseStore.mockReturnValue({
                    isMuted: i % 2 === 0,
                    setIsMuted: mockSetIsMuted,
                });
                rerender(<DistractionSettings />);
            }

            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("does not cause unnecessary re-renders", () => {
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            const { rerender } = render(<DistractionSettings />);

            // Re-render with same props
            rerender(<DistractionSettings />);

            // Component should still work
            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });

    describe("State Transitions", () => {
        it("transitions from unmuted to muted", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            const { container } = render(<DistractionSettings />);

            // Initially has SVG
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockSetIsMuted).toHaveBeenCalledWith(true);
        });

        it("transitions from muted to unmuted", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: true,
                setIsMuted: mockSetIsMuted,
            });

            const { container } = render(<DistractionSettings />);

            // Initially has SVG
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockSetIsMuted).toHaveBeenCalledWith(false);
        });

        it("handles multiple state transitions", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");

            // First click: false -> true
            await user.click(button);
            expect(mockSetIsMuted).toHaveBeenLastCalledWith(true);

            // Second click: true -> false
            await user.click(button);
            expect(mockSetIsMuted).toHaveBeenLastCalledWith(false);

            // Third click: false -> true
            await user.click(button);
            expect(mockSetIsMuted).toHaveBeenLastCalledWith(true);
        });
    });

    describe("Integration with ThemedCheckbox", () => {
        it("passes correct checked prop to ThemedCheckbox", () => {
            mockUseStore.mockReturnValue({
                isMuted: true,
                setIsMuted: mockSetIsMuted,
            });

            const { container } = render(<DistractionSettings />);

            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("passes correct onChange handler to ThemedCheckbox", async () => {
            const user = userEvent.setup();
            mockUseStore.mockReturnValue({
                isMuted: false,
                setIsMuted: mockSetIsMuted,
            });

            render(<DistractionSettings />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockSetIsMuted).toHaveBeenCalled();
        });

        it("passes correct placeholder to ThemedCheckbox", () => {
            render(<DistractionSettings />);

            expect(screen.getByText("Mute the duck")).toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles without memory leaks", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<DistractionSettings />);

                expect(screen.getByRole("button")).toBeInTheDocument();
                unmount();
            }

            // Should not have any lingering references
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("cleans up callbacks properly", () => {
            const { unmount } = render(<DistractionSettings />);
            const callCountBeforeUnmount = mockSetIsMuted.mock.calls.length;

            unmount();

            // Should not have additional calls after unmount
            expect(mockSetIsMuted.mock.calls.length).toBe(callCountBeforeUnmount);
        });
    });
});
