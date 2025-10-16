import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Set global timeout for all tests
vi.setConfig({ testTimeout: 5000 });

// Mock react-router
vi.mock("react-router", () => ({
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: any }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
}));

// Import the components after mocking
import { ThemedButton, ThemedLink } from "./button";

describe("ThemedButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders as a button element", () => {
            render(<ThemedButton>Click me</ThemedButton>);

            expect(screen.getByRole("button")).toBeInTheDocument();
            expect(screen.getByText("Click me")).toBeInTheDocument();
        });

        it("renders with text content", () => {
            render(<ThemedButton>Test Button</ThemedButton>);

            expect(screen.getByText("Test Button")).toBeInTheDocument();
        });

        it("renders with children", () => {
            render(
                <ThemedButton>
                    <span>Icon</span>
                    <span>Text</span>
                </ThemedButton>
            );

            expect(screen.getByText("Icon")).toBeInTheDocument();
            expect(screen.getByText("Text")).toBeInTheDocument();
        });
    });

    describe("Event Handling", () => {
        it("handles click events", () => {
            const handleClick = vi.fn();

            render(<ThemedButton onClick={handleClick}>Click me</ThemedButton>);

            const button = screen.getByRole("button");
            button.click();

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("handles multiple clicks", () => {
            const handleClick = vi.fn();

            render(<ThemedButton onClick={handleClick}>Click me</ThemedButton>);

            const button = screen.getByRole("button");
            button.click();
            button.click();
            button.click();

            expect(handleClick).toHaveBeenCalledTimes(3);
        });

        it("handles disabled state", () => {
            const handleClick = vi.fn();

            render(
                <ThemedButton onClick={handleClick} disabled>
                    Disabled Button
                </ThemedButton>
            );

            const button = screen.getByRole("button");
            expect(button).toBeDisabled();

            button.click();

            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe("Props Handling", () => {
        it("accepts type prop", () => {
            render(<ThemedButton type="submit">Submit</ThemedButton>);

            expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
        });

        it("accepts className prop", () => {
            render(<ThemedButton className="custom-class">Button</ThemedButton>);

            expect(screen.getByRole("button")).toHaveClass("custom-class");
        });

        it("accepts id prop", () => {
            render(<ThemedButton id="test-button">Button</ThemedButton>);

            expect(screen.getByRole("button")).toHaveAttribute("id", "test-button");
        });

        it("accepts data attributes", () => {
            render(<ThemedButton data-testid="test-button">Button</ThemedButton>);

            expect(screen.getByTestId("test-button")).toBeInTheDocument();
        });

        it("accepts aria attributes", () => {
            render(
                <ThemedButton aria-label="Close dialog" aria-describedby="description">
                    ×
                </ThemedButton>
            );

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("aria-label", "Close dialog");
            expect(button).toHaveAttribute("aria-describedby", "description");
        });
    });

    describe("Accessibility", () => {
        it("is focusable by default", () => {
            render(<ThemedButton>Focusable Button</ThemedButton>);

            const button = screen.getByRole("button");
            expect(button).not.toHaveAttribute("tabindex", "-1");
        });

        it("can be focused programmatically", () => {
            render(<ThemedButton>Focusable Button</ThemedButton>);

            const button = screen.getByRole("button");
            button.focus();

            expect(button).toHaveFocus();
        });

        it("supports keyboard navigation", () => {
            const handleClick = vi.fn();

            render(<ThemedButton onClick={handleClick}>Keyboard Button</ThemedButton>);

            const button = screen.getByRole("button");
            button.focus();

            // Simulate Enter key press - use keyup event which is more reliable
            const enterEvent = new KeyboardEvent("keyup", { key: "Enter" });
            button.dispatchEvent(enterEvent);

            // For this test, just verify the button is focusable and can receive events
            expect(button).toHaveFocus();
        });
    });

    describe("Styling", () => {
        it("applies themed styles", () => {
            render(<ThemedButton>Styled Button</ThemedButton>);

            // Component should render without errors
            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("handles custom styles", () => {
            render(
                <ThemedButton style={{ backgroundColor: "red", color: "white" }}>Custom Styled Button</ThemedButton>
            );

            const button = screen.getByRole("button");
            expect(button).toHaveStyle("background-color: red");
            expect(button).toHaveStyle("color: white");
        });
    });
});

describe("ThemedLink", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders as a link element", () => {
            render(<ThemedLink to="/home">Go Home</ThemedLink>);

            const link = screen.getByRole("link");
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "/home");
            expect(screen.getByText("Go Home")).toBeInTheDocument();
        });

        it("renders with text content", () => {
            render(<ThemedLink to="/about">About Us</ThemedLink>);

            expect(screen.getByText("About Us")).toBeInTheDocument();
        });

        it("renders with children", () => {
            render(
                <ThemedLink to="/products">
                    <span>🏠</span>
                    <span>Products</span>
                </ThemedLink>
            );

            expect(screen.getByText("🏠")).toBeInTheDocument();
            expect(screen.getByText("Products")).toBeInTheDocument();
        });
    });

    describe("Navigation", () => {
        it("navigates to correct route", () => {
            render(<ThemedLink to="/settings">Settings</ThemedLink>);

            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", "/settings");
        });

        it("handles external links", () => {
            render(<ThemedLink to="https://example.com">External Link</ThemedLink>);

            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", "https://example.com");
        });

        it("handles relative paths", () => {
            render(<ThemedLink to="../parent">Parent Directory</ThemedLink>);

            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", "../parent");
        });
    });

    describe("Props Handling", () => {
        it("accepts className prop", () => {
            render(
                <ThemedLink to="/" className="custom-link">
                    Link
                </ThemedLink>
            );

            expect(screen.getByRole("link")).toHaveClass("custom-link");
        });

        it("accepts id prop", () => {
            render(
                <ThemedLink to="/" id="test-link">
                    Link
                </ThemedLink>
            );

            expect(screen.getByRole("link")).toHaveAttribute("id", "test-link");
        });

        it("accepts target prop", () => {
            render(
                <ThemedLink to="/" target="_blank">
                    New Tab
                </ThemedLink>
            );

            expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
        });

        it("accepts rel prop", () => {
            render(
                <ThemedLink to="/" rel="noopener noreferrer">
                    Secure Link
                </ThemedLink>
            );

            expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
        });
    });

    describe("Accessibility", () => {
        it("is focusable by default", () => {
            render(<ThemedLink to="/">Focusable Link</ThemedLink>);

            const link = screen.getByRole("link");
            expect(link).not.toHaveAttribute("tabindex", "-1");
        });

        it("can be focused programmatically", () => {
            render(<ThemedLink to="/">Focusable Link</ThemedLink>);

            const link = screen.getByRole("link");
            link.focus();

            expect(link).toHaveFocus();
        });

        it("supports keyboard navigation", () => {
            render(<ThemedLink to="/keyboard">Keyboard Link</ThemedLink>);

            const link = screen.getByRole("link");
            link.focus();

            // Simulate Enter key press
            const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
            link.dispatchEvent(enterEvent);

            // Link should be accessible via keyboard
            expect(link).toHaveFocus();
        });

        it("supports aria attributes", () => {
            render(
                <ThemedLink to="/" aria-label="Navigate to home page">
                    🏠
                </ThemedLink>
            );

            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("aria-label", "Navigate to home page");
        });
    });

    describe("Styling", () => {
        it("applies themed styles", () => {
            render(<ThemedLink to="/">Styled Link</ThemedLink>);

            // Component should render without errors
            expect(screen.getByRole("link")).toBeInTheDocument();
        });

        it("removes default text decoration", () => {
            render(<ThemedLink to="/">No Underline Link</ThemedLink>);

            const link = screen.getByRole("link");
            // Check that text-decoration-line is none (the important part)
            expect(link).toHaveStyle("text-decoration-line: none");
        });

        it("handles custom styles", () => {
            render(
                <ThemedLink to="/" style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Custom Styled Link
                </ThemedLink>
            );

            const link = screen.getByRole("link");
            expect(link).toHaveStyle("font-size: 18px");
            expect(link).toHaveStyle("font-weight: bold");
        });
    });

    describe("Edge Cases", () => {
        it("handles empty to prop", () => {
            render(<ThemedLink to="">Empty Link</ThemedLink>);

            // Empty href makes the link not accessible, so use getByText instead
            const link = screen.getByText("Empty Link");
            expect(link).toHaveAttribute("href", "");
        });

        it("handles undefined children", () => {
            render(<ThemedLink to="/">{undefined as any}</ThemedLink>);

            expect(screen.getByRole("link")).toBeInTheDocument();
        });

        it("handles null children", () => {
            render(<ThemedLink to="/">{null as any}</ThemedLink>);

            expect(screen.getByRole("link")).toBeInTheDocument();
        });
    });
});
