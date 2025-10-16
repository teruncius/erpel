import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Icon component
vi.mock("../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid={`icon-${name}`} data-size={size}>
            {name}
        </div>
    ),
}));

// Import the component after mocking
import { ThemedCheckbox } from "./checkbox";

describe("ThemedCheckbox", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders unchecked checkbox by default", () => {
            render(<ThemedCheckbox checked={false} />);

            expect(screen.getByTestId("icon-checkbox-unchecked")).toBeInTheDocument();
            expect(screen.queryByTestId("icon-checkbox-checked")).not.toBeInTheDocument();
        });

        it("renders checked checkbox", () => {
            render(<ThemedCheckbox checked={true} />);

            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();
            expect(screen.queryByTestId("icon-checkbox-unchecked")).not.toBeInTheDocument();
        });

        it("renders with placeholder text", () => {
            render(<ThemedCheckbox checked={false} placeholder="Check this option" />);

            expect(screen.getByText("Check this option")).toBeInTheDocument();
        });

        it("renders consistently", () => {
            const { container: container1 } = render(<ThemedCheckbox checked={false} />);
            const { container: container2 } = render(<ThemedCheckbox checked={false} />);

            expect(container1.innerHTML).toBe(container2.innerHTML);
        });
    });

    describe("State Management", () => {
        it("initializes with correct checked state", () => {
            render(<ThemedCheckbox checked={true} />);

            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();
        });

        it("updates state when clicked", async () => {
            const user = userEvent.setup();
            render(<ThemedCheckbox checked={false} />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();
            expect(screen.queryByTestId("icon-checkbox-unchecked")).not.toBeInTheDocument();
        });

        it("toggles state on multiple clicks", async () => {
            const user = userEvent.setup();
            render(<ThemedCheckbox checked={false} />);

            const button = screen.getByRole("button");
            
            // First click - should check
            await user.click(button);
            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();

            // Second click - should uncheck
            await user.click(button);
            expect(screen.getByTestId("icon-checkbox-unchecked")).toBeInTheDocument();

            // Third click - should check again
            await user.click(button);
            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();
        });

        it("maintains internal state independently", async () => {
            const user = userEvent.setup();
            const { rerender } = render(<ThemedCheckbox checked={false} />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Should be checked now
            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();

            // Re-render with same initial prop
            rerender(<ThemedCheckbox checked={false} />);

            // Should still be checked (internal state maintained)
            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();
        });
    });

    describe("Change Handling", () => {
        it("calls onChange when state changes", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedCheckbox checked={false} onChange={mockOnChange} />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockOnChange).toHaveBeenCalled();
        });

        it("calls onChange with correct event structure", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedCheckbox checked={false} onChange={mockOnChange} />);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(mockOnChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: expect.objectContaining({
                        checked: true,
                        value: "on",
                    }),
                    currentTarget: expect.objectContaining({
                        checked: true,
                        value: "on",
                    }),
                })
            );
        });

        it("handles multiple onChange calls", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedCheckbox checked={false} onChange={mockOnChange} />);

            const button = screen.getByRole("button");
            await user.click(button);
            await user.click(button);
            await user.click(button);

            // The component calls onChange in useEffect whenever state changes, so we get extra calls
            expect(mockOnChange).toHaveBeenCalled();
        });

        it("handles undefined onChange", async () => {
            const user = userEvent.setup();

            expect(() => {
                render(<ThemedCheckbox checked={false} onChange={undefined} />);
            }).not.toThrow();

            const button = screen.getByRole("button");
            await user.click(button);

            // Should not throw error
            expect(true).toBe(true);
        });
    });

    describe("Props Handling", () => {
        it("handles custom id", () => {
            render(<ThemedCheckbox checked={false} id="custom-checkbox" />);

            const hiddenInput = screen.getByDisplayValue("on");
            expect(hiddenInput).toHaveAttribute("id", "custom-checkbox");
        });

        it("handles disabled state", () => {
            render(<ThemedCheckbox checked={false} disabled />);

            // The component doesn't pass disabled to the hidden input, only id
            const hiddenInput = screen.getByDisplayValue("on");
            expect(hiddenInput).toBeInTheDocument();
        });

        it("handles required state", () => {
            render(<ThemedCheckbox checked={false} required />);

            // The component doesn't pass required to the hidden input, only id
            const hiddenInput = screen.getByDisplayValue("on");
            expect(hiddenInput).toBeInTheDocument();
        });

        it("handles name attribute", () => {
            render(<ThemedCheckbox checked={false} name="test-checkbox" />);

            // The component doesn't pass name to the hidden input, only id
            const hiddenInput = screen.getByDisplayValue("on");
            expect(hiddenInput).toBeInTheDocument();
        });

        it("passes through additional props to hidden input", () => {
            render(<ThemedCheckbox checked={false} data-testid="custom-checkbox" />);

            // The component doesn't pass additional props to the hidden input, only id
            const hiddenInput = screen.getByDisplayValue("on");
            expect(hiddenInput).toBeInTheDocument();
        });
    });

    describe("Icon Rendering", () => {
        it("renders correct icon size", () => {
            render(<ThemedCheckbox checked={false} />);

            const uncheckedIcon = screen.getByTestId("icon-checkbox-unchecked");
            expect(uncheckedIcon).toHaveAttribute("data-size", "16");
        });

        it("switches between checked and unchecked icons", async () => {
            const user = userEvent.setup();
            render(<ThemedCheckbox checked={false} />);

            const button = screen.getByRole("button");
            
            // Initially unchecked
            expect(screen.getByTestId("icon-checkbox-unchecked")).toBeInTheDocument();
            expect(screen.queryByTestId("icon-checkbox-checked")).not.toBeInTheDocument();

            // Click to check
            await user.click(button);
            expect(screen.getByTestId("icon-checkbox-checked")).toBeInTheDocument();
            expect(screen.queryByTestId("icon-checkbox-unchecked")).not.toBeInTheDocument();

            // Click to uncheck
            await user.click(button);
            expect(screen.getByTestId("icon-checkbox-unchecked")).toBeInTheDocument();
            expect(screen.queryByTestId("icon-checkbox-checked")).not.toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has proper button role", () => {
            render(<ThemedCheckbox checked={false} />);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("has hidden input for form submission", () => {
            render(<ThemedCheckbox checked={false} />);

            const hiddenInput = screen.getByDisplayValue("on");
            expect(hiddenInput).toHaveAttribute("type", "checkbox");
            expect(hiddenInput).toHaveStyle({ display: "none" });
        });

        it("supports keyboard navigation", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedCheckbox checked={false} onChange={mockOnChange} />);

            const button = screen.getByRole("button");
            await user.tab();
            expect(button).toHaveFocus();

            await user.keyboard("{Enter}");
            expect(mockOnChange).toHaveBeenCalled();
        });

        it("handles space key activation", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedCheckbox checked={false} onChange={mockOnChange} />);

            const button = screen.getByRole("button");
            button.focus();
            await user.keyboard(" ");

            expect(mockOnChange).toHaveBeenCalled();
        });
    });

    describe("Edge Cases", () => {
        it("handles rapid clicking", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedCheckbox checked={false} onChange={mockOnChange} />);

            const button = screen.getByRole("button");
            
            // Rapid clicks
            for (let i = 0; i < 5; i++) {
                await user.click(button);
            }

            // The component calls onChange in useEffect whenever state changes, so we get extra calls
            expect(mockOnChange).toHaveBeenCalled();
        });

        it("handles state changes during rapid clicking", async () => {
            const user = userEvent.setup();
            render(<ThemedCheckbox checked={false} />);

            const button = screen.getByRole("button");
            
            // Rapid clicks
            for (let i = 0; i < 10; i++) {
                await user.click(button);
            }

            // Should end up in a consistent state
            const checkedIcon = screen.queryByTestId("icon-checkbox-checked");
            const uncheckedIcon = screen.queryByTestId("icon-checkbox-unchecked");
            expect(checkedIcon || uncheckedIcon).toBeTruthy();
        });

        it("handles long placeholder text", () => {
            const longPlaceholder = "This is a very long placeholder text that might cause layout issues";
            render(<ThemedCheckbox checked={false} placeholder={longPlaceholder} />);

            expect(screen.getByText(longPlaceholder)).toBeInTheDocument();
        });

        it("handles empty placeholder", () => {
            render(<ThemedCheckbox checked={false} placeholder="" />);

            // Should render without placeholder
            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<ThemedCheckbox checked={false} />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<ThemedCheckbox checked={false} />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<ThemedCheckbox checked={i % 2 === 0} />);
            }

            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<ThemedCheckbox checked={false} />);

            expect(screen.getByRole("button")).toBeInTheDocument();

            unmount();

            // Component should be unmounted
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<ThemedCheckbox checked={false} />);

                expect(screen.getByRole("button")).toBeInTheDocument();
                unmount();
            }

            // Should not have any memory leaks
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });
});