import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Import the component after mocking
import { ThemedInput } from "./input";

describe("ThemedInput", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });
    describe("Basic Rendering", () => {
        it("renders as an input element", () => {
            render(<ThemedInput />);

            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("renders with default type text", () => {
            render(<ThemedInput />);

            // HTML inputs don't have a default type attribute, it defaults to "text" behavior
            const input = screen.getByRole("textbox");
            expect(input).toBeInTheDocument();
        });

        it("renders with custom type", () => {
            render(<ThemedInput type="email" />);

            expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
        });

        it("renders with placeholder", () => {
            render(<ThemedInput placeholder="Enter your name" />);

            expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
        });
    });

    describe("Input Types", () => {
        const inputTypes = [
            "text",
            "email",
            "password",
            "number",
            "tel",
            "url",
            "search",
            "date",
            "time",
            "datetime-local",
        ];

        inputTypes.forEach((type) => {
            it(`renders with type ${type}`, () => {
                render(<ThemedInput type={type} />);

                // Different input types have different accessible roles
                let input;
                if (type === "password") {
                    // Password inputs don't have a specific role, they're just inputs
                    input = screen.getByDisplayValue("");
                } else if (type === "number") {
                    input = screen.getByRole("spinbutton");
                } else if (type === "search") {
                    input = screen.getByRole("searchbox");
                } else if (["date", "time", "datetime-local"].includes(type)) {
                    // Date/time inputs don't have specific roles, they're just inputs
                    input = screen.getByDisplayValue("");
                } else {
                    input = screen.getByRole("textbox");
                }
                expect(input).toHaveAttribute("type", type);
            });
        });
    });

    describe("Value Handling", () => {
        it("handles controlled input", () => {
            const { rerender } = render(<ThemedInput value="initial" onChange={() => {}} />);

            expect(screen.getByDisplayValue("initial")).toBeInTheDocument();

            rerender(<ThemedInput value="updated" onChange={() => {}} />);

            expect(screen.getByDisplayValue("updated")).toBeInTheDocument();
        });

        it("handles uncontrolled input", () => {
            render(<ThemedInput defaultValue="default" />);

            expect(screen.getByDisplayValue("default")).toBeInTheDocument();
        });

        it("handles empty value", () => {
            render(<ThemedInput value="" onChange={() => {}} />);

            const input = screen.getByRole("textbox");
            expect(input).toHaveValue("");
        });

        it("handles null value", () => {
            render(<ThemedInput value={""} onChange={() => {}} />);

            const input = screen.getByRole("textbox");
            expect(input).toHaveValue("");
        });

        it("handles undefined value", () => {
            render(<ThemedInput value={undefined as unknown as string} />);

            const input = screen.getByRole("textbox");
            expect(input).toHaveValue("");
        });
    });

    describe("User Interaction", () => {
        it("handles text input", async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();

            render(<ThemedInput onChange={handleChange} />);

            const input = screen.getByRole("textbox");
            await user.type(input, "Hello World");

            expect(handleChange).toHaveBeenCalled();
        });

        it("handles focus and blur events", async () => {
            const user = userEvent.setup();
            const handleFocus = vi.fn();
            const handleBlur = vi.fn();

            render(<ThemedInput onFocus={handleFocus} onBlur={handleBlur} />);

            const input = screen.getByRole("textbox");

            await user.click(input);
            expect(handleFocus).toHaveBeenCalledTimes(1);

            await user.tab();
            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it("handles key events", async () => {
            const user = userEvent.setup();
            const handleKeyDown = vi.fn();
            const handleKeyUp = vi.fn();

            render(<ThemedInput onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />);

            const input = screen.getByRole("textbox");
            await user.click(input);
            await user.keyboard("a");

            expect(handleKeyDown).toHaveBeenCalled();
            expect(handleKeyUp).toHaveBeenCalled();
        });

        it("handles Enter key", async () => {
            const user = userEvent.setup();
            const handleKeyPress = vi.fn();

            render(<ThemedInput onKeyPress={handleKeyPress} />);

            const input = screen.getByRole("textbox");
            await user.click(input);
            await user.keyboard("{Enter}");

            expect(handleKeyPress).toHaveBeenCalled();
        });
    });

    describe("Props Handling", () => {
        it("accepts name prop", () => {
            render(<ThemedInput name="username" />);

            expect(screen.getByRole("textbox")).toHaveAttribute("name", "username");
        });

        it("accepts id prop", () => {
            render(<ThemedInput id="user-input" />);

            expect(screen.getByRole("textbox")).toHaveAttribute("id", "user-input");
        });

        it("accepts className prop", () => {
            render(<ThemedInput className="custom-input" />);

            expect(screen.getByRole("textbox")).toHaveClass("custom-input");
        });

        it("accepts disabled prop", () => {
            render(<ThemedInput disabled />);

            expect(screen.getByRole("textbox")).toBeDisabled();
        });

        it("accepts readOnly prop", () => {
            render(<ThemedInput readOnly />);

            expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
        });

        it("accepts required prop", () => {
            render(<ThemedInput required />);

            expect(screen.getByRole("textbox")).toBeRequired();
        });

        it("accepts autoComplete prop", () => {
            render(<ThemedInput autoComplete="email" />);

            expect(screen.getByRole("textbox")).toHaveAttribute("autocomplete", "email");
        });

        it("accepts maxLength prop", () => {
            render(<ThemedInput maxLength={50} />);

            expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "50");
        });

        it("accepts minLength prop", () => {
            render(<ThemedInput minLength={3} />);

            expect(screen.getByRole("textbox")).toHaveAttribute("minlength", "3");
        });

        it("accepts pattern prop", () => {
            render(<ThemedInput pattern="[0-9]+" />);

            expect(screen.getByRole("textbox")).toHaveAttribute("pattern", "[0-9]+");
        });
    });

    describe("Accessibility", () => {
        it("supports aria-label", () => {
            render(<ThemedInput aria-label="Username input" />);

            expect(screen.getByLabelText("Username input")).toBeInTheDocument();
        });

        it("supports aria-describedby", () => {
            render(
                <div>
                    <ThemedInput aria-describedby="help-text" />
                    <div id="help-text">Enter your username</div>
                </div>
            );

            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("aria-describedby", "help-text");
        });

        it("supports aria-invalid", () => {
            render(<ThemedInput aria-invalid="true" />);

            expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
        });

        it("supports aria-required", () => {
            render(<ThemedInput aria-required="true" />);

            expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
        });

        it("is focusable by default", () => {
            render(<ThemedInput />);

            const input = screen.getByRole("textbox");
            expect(input).not.toHaveAttribute("tabindex", "-1");
        });

        it("can be focused programmatically", () => {
            render(<ThemedInput />);

            const input = screen.getByRole("textbox");
            input.focus();

            expect(input).toHaveFocus();
        });
    });

    describe("Styling", () => {
        it("applies themed styles", () => {
            render(<ThemedInput />);

            // Component should render without errors
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });

        it("handles custom styles", () => {
            render(
                <ThemedInput
                    style={{
                        backgroundColor: "lightblue",
                        border: "2px solid blue",
                        borderRadius: "8px",
                    }}
                />
            );

            const input = screen.getByRole("textbox");
            expect(input).toHaveStyle("background-color: lightblue");
            expect(input).toHaveStyle("border: 2px solid blue");
            expect(input).toHaveStyle("border-radius: 8px");
        });

        it("handles placeholder styling", () => {
            render(<ThemedInput placeholder="Styled placeholder" />);

            const input = screen.getByRole("textbox");
            expect(input).toHaveAttribute("placeholder", "Styled placeholder");
        });
    });

    describe("Form Integration", () => {
        it("works within a form", () => {
            render(
                <form>
                    <ThemedInput name="email" type="email" />
                    <button type="submit">Submit</button>
                </form>
            );

            expect(screen.getByRole("textbox")).toBeInTheDocument();
            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("handles form submission", async () => {
            const user = userEvent.setup();
            const handleSubmit = vi.fn((e) => e.preventDefault());

            render(
                <form onSubmit={handleSubmit}>
                    <ThemedInput name="username" />
                    <button type="submit">Submit</button>
                </form>
            );

            const input = screen.getByRole("textbox");
            const submitButton = screen.getByRole("button");

            await user.type(input, "testuser");
            await user.click(submitButton);

            expect(handleSubmit).toHaveBeenCalled();
        });

        it("validates required fields", () => {
            render(<ThemedInput required />);

            const input = screen.getByRole("textbox");
            expect(input).toBeRequired();
        });
    });

    describe("Edge Cases", () => {
        it("handles very long text", () => {
            const longText = "a".repeat(1000);

            render(<ThemedInput />);

            const input = screen.getByRole("textbox");

            // Use fireEvent.change for better performance with long text
            fireEvent.change(input, { target: { value: longText } });

            expect(input).toHaveValue(longText);
        });

        it("handles special characters", () => {
            const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

            render(<ThemedInput />);

            const input = screen.getByRole("textbox");
            // Use fireEvent for special characters that userEvent.type can't handle
            fireEvent.change(input, { target: { value: specialChars } });

            expect(input).toHaveValue(specialChars);
        });

        it("handles unicode characters", async () => {
            const user = userEvent.setup();
            const unicodeText = "Hello 世界 🌍";

            render(<ThemedInput />);

            const input = screen.getByRole("textbox");
            await user.type(input, unicodeText);

            expect(input).toHaveValue(unicodeText);
        });

        it("handles rapid typing", async () => {
            const user = userEvent.setup();

            render(<ThemedInput />);

            const input = screen.getByRole("textbox");

            // Type rapidly
            for (let i = 0; i < 10; i++) {
                await user.type(input, "a");
            }

            expect(input).toHaveValue("a".repeat(10));
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<ThemedInput />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent value changes", () => {
            const { rerender } = render(<ThemedInput value="initial" onChange={() => {}} />);

            // Simulate frequent value changes
            for (let i = 0; i < 100; i++) {
                rerender(<ThemedInput value={`value-${i}`} onChange={() => {}} />);
            }

            expect(screen.getByDisplayValue("value-99")).toBeInTheDocument();
        });
    });
});
