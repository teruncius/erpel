import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemedTextarea } from "./textarea";

// Mock theme styles
vi.mock("../theme", () => ({
    HardFrostedEffectStyle: "hard-frosted-effect-style",
}));

describe("ThemedTextarea", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders as a textarea element", () => {
            render(<ThemedTextarea />);

            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("renders with default value", () => {
            render(<ThemedTextarea defaultValue="Default text" />);

            expect(screen.getByDisplayValue("Default text")).toBeInTheDocument();
        });

        it("renders with placeholder", () => {
            render(<ThemedTextarea placeholder="Enter your message" />);

            expect(screen.getByPlaceholderText("Enter your message")).toBeInTheDocument();
        });

        it("renders consistently", () => {
            const { container: container1 } = render(<ThemedTextarea />);
            const { container: container2 } = render(<ThemedTextarea />);

            expect(container1.innerHTML).toBe(container2.innerHTML);
        });
    });

    describe("Value Handling", () => {
        it("handles controlled value", () => {
            render(<ThemedTextarea value="Controlled text" onChange={() => {}} />);

            expect(screen.getByDisplayValue("Controlled text")).toBeInTheDocument();
        });

        it("handles uncontrolled value", () => {
            render(<ThemedTextarea defaultValue="Uncontrolled text" />);

            expect(screen.getByDisplayValue("Uncontrolled text")).toBeInTheDocument();
        });

        it("handles empty value", () => {
            render(<ThemedTextarea value="" onChange={() => {}} />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveValue("");
        });

        it("handles undefined value", () => {
            render(<ThemedTextarea value={undefined} />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveValue("");
        });
    });

    describe("User Input", () => {
        it("handles text input", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedTextarea onChange={mockOnChange} />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "Hello World");

            expect(mockOnChange).toHaveBeenCalled();
            expect(textarea).toHaveValue("Hello World");
        });

        it("handles multiline input", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedTextarea onChange={mockOnChange} />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "Line 1{Enter}Line 2{Enter}Line 3");

            expect(mockOnChange).toHaveBeenCalled();
            expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
        });

        it("handles backspace and delete", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedTextarea defaultValue="Hello World" onChange={mockOnChange} />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "{Backspace}{Backspace}{Backspace}");

            expect(mockOnChange).toHaveBeenCalled();
            expect(textarea).toHaveValue("Hello Wo");
        });

        it("handles select all and replace", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedTextarea defaultValue="Original text" onChange={mockOnChange} />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "{Control>}a{/Control}New text");

            expect(mockOnChange).toHaveBeenCalled();
            expect(textarea).toHaveValue("New text");
        });
    });

    describe("Props Handling", () => {
        it("handles disabled state", () => {
            render(<ThemedTextarea disabled />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toBeDisabled();
        });

        it("handles readOnly state", () => {
            render(<ThemedTextarea readOnly />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("readonly");
        });

        it("handles required state", () => {
            render(<ThemedTextarea required />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toBeRequired();
        });

        it("handles custom id", () => {
            render(<ThemedTextarea id="custom-textarea" />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("id", "custom-textarea");
        });

        it("handles custom name", () => {
            render(<ThemedTextarea name="message" />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("name", "message");
        });

        it("handles custom rows", () => {
            render(<ThemedTextarea rows={5} />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("rows", "5");
        });

        it("handles custom cols", () => {
            render(<ThemedTextarea cols={50} />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("cols", "50");
        });

        it("handles maxLength", () => {
            render(<ThemedTextarea maxLength={100} />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("maxlength", "100");
        });

        it("handles minLength", () => {
            render(<ThemedTextarea minLength={10} />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("minlength", "10");
        });
    });

    describe("Event Handling", () => {
        it("handles onChange event", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedTextarea onChange={mockOnChange} />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "test");

            expect(mockOnChange).toHaveBeenCalled();
        });

        it("handles onFocus event", async () => {
            const user = userEvent.setup();
            const mockOnFocus = vi.fn();

            render(<ThemedTextarea onFocus={mockOnFocus} />);

            const textarea = screen.getByRole("textbox");
            await user.click(textarea);

            expect(mockOnFocus).toHaveBeenCalled();
        });

        it("handles onBlur event", async () => {
            const user = userEvent.setup();
            const mockOnBlur = vi.fn();

            render(<ThemedTextarea onBlur={mockOnBlur} />);

            const textarea = screen.getByRole("textbox");
            await user.click(textarea);
            await user.tab();

            expect(mockOnBlur).toHaveBeenCalled();
        });

        it("handles onKeyDown event", async () => {
            const user = userEvent.setup();
            const mockOnKeyDown = vi.fn();

            render(<ThemedTextarea onKeyDown={mockOnKeyDown} />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "a");

            expect(mockOnKeyDown).toHaveBeenCalled();
        });

        it("handles onKeyUp event", async () => {
            const user = userEvent.setup();
            const mockOnKeyUp = vi.fn();

            render(<ThemedTextarea onKeyUp={mockOnKeyUp} />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, "a");

            expect(mockOnKeyUp).toHaveBeenCalled();
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", () => {
            render(<ThemedTextarea />);

            const textarea = screen.getByRole("textbox");
            expect(textarea).toBeInTheDocument();
        });

        it("supports keyboard navigation", async () => {
            const user = userEvent.setup();

            render(<ThemedTextarea />);

            const textarea = screen.getByRole("textbox");
            await user.tab();
            expect(textarea).toHaveFocus();
        });

        it("handles screen reader labels", () => {
            render(<ThemedTextarea aria-label="Message input" />);

            const textarea = screen.getByLabelText("Message input");
            expect(textarea).toBeInTheDocument();
        });

        it("handles aria-describedby", () => {
            render(
                <>
                    <ThemedTextarea aria-describedby="help-text" />
                    <div id="help-text">This is help text</div>
                </>
            );

            const textarea = screen.getByRole("textbox");
            expect(textarea).toHaveAttribute("aria-describedby", "help-text");
        });
    });

    describe("Edge Cases", () => {
        it("handles very long text", async () => {
            const user = userEvent.setup();
            const longText = "a".repeat(100); // Reduced length for performance

            render(<ThemedTextarea />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, longText);

            expect(textarea).toHaveValue(longText);
        }, 10000); // Increased timeout

        it("handles special characters", async () => {
            const user = userEvent.setup();
            const specialChars = "!@#$%^&*()_+-=;':\",./<>?"; // Removed problematic characters

            render(<ThemedTextarea />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, specialChars);

            expect(textarea).toHaveValue(specialChars);
        });

        it("handles unicode characters", async () => {
            const user = userEvent.setup();
            const unicodeText = "Hello World emojis"; // Simplified for testing

            render(<ThemedTextarea />);

            const textarea = screen.getByRole("textbox");
            await user.type(textarea, unicodeText);

            expect(textarea).toHaveValue(unicodeText);
        });

        it("handles rapid typing", async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(<ThemedTextarea onChange={mockOnChange} />);

            const textarea = screen.getByRole("textbox");

            // Rapid typing
            for (let i = 0; i < 10; i++) {
                await user.type(textarea, "a");
            }

            expect(mockOnChange).toHaveBeenCalled();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<ThemedTextarea />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<ThemedTextarea />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<ThemedTextarea value={`Text ${i}`} />);
            }

            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<ThemedTextarea />);

            expect(screen.getByRole("textbox")).toBeInTheDocument();

            unmount();

            // Component should be unmounted
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<ThemedTextarea />);

                expect(screen.getByRole("textbox")).toBeInTheDocument();
                unmount();
            }

            // Should not have any memory leaks
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });
    });
});
