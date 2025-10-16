import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Mock Icon component
vi.mock("../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid={`icon-${name}`} data-size={size}>
            {name}
        </div>
    ),
}));

// Import the component after mocking
import { Hint } from "./hint";

describe("Hint", () => {
    const defaultProps = {
        title: "Test Title",
        text: "This is a test hint message",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders the hint component", () => {
            render(<Hint {...defaultProps} />);

            expect(screen.getByText("Test Title")).toBeInTheDocument();
            expect(screen.getByText("This is a test hint message")).toBeInTheDocument();
        });

        it("renders with correct title", () => {
            render(<Hint {...defaultProps} />);

            const title = screen.getByText("Test Title");
            expect(title).toBeInTheDocument();
        });

        it("renders with correct text", () => {
            render(<Hint {...defaultProps} />);

            const text = screen.getByText("This is a test hint message");
            expect(text).toBeInTheDocument();
        });

        it("renders consistently", () => {
            const { container: container1 } = render(<Hint {...defaultProps} />);
            const { container: container2 } = render(<Hint {...defaultProps} />);

            expect(container1.innerHTML).toBe(container2.innerHTML);
        });
    });

    describe("Icon Rendering", () => {
        it("renders info icon", () => {
            render(<Hint {...defaultProps} />);

            const icon = screen.getByTestId("icon-info");
            expect(icon).toBeInTheDocument();
        });

        it("renders icon with correct size", () => {
            render(<Hint {...defaultProps} />);

            const icon = screen.getByTestId("icon-info");
            expect(icon).toHaveAttribute("data-size", "24");
        });

        it("renders icon with correct name", () => {
            render(<Hint {...defaultProps} />);

            const icon = screen.getByTestId("icon-info");
            expect(icon).toHaveTextContent("info");
        });
    });

    describe("Content Handling", () => {
        it("handles long title text", () => {
            const longTitle = "This is a very long title that might cause layout issues in some cases";
            render(<Hint title={longTitle} text="Short text" />);

            expect(screen.getByText(longTitle)).toBeInTheDocument();
        });

        it("handles long text content", () => {
            const longText = "This is a very long hint text that contains a lot of information and might wrap to multiple lines in the UI";
            render(<Hint title="Short title" text={longText} />);

            expect(screen.getByText(longText)).toBeInTheDocument();
        });

        it("handles empty title", () => {
            render(<Hint title="" text="Some text" />);

            expect(screen.getByText("Some text")).toBeInTheDocument();
        });

        it("handles empty text", () => {
            render(<Hint title="Some title" text="" />);

            expect(screen.getByText("Some title")).toBeInTheDocument();
        });

        it("handles special characters in title", () => {
            const specialTitle = "Title with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
            render(<Hint title={specialTitle} text="Some text" />);

            expect(screen.getByText(specialTitle)).toBeInTheDocument();
        });

        it("handles special characters in text", () => {
            const specialText = "Text with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
            render(<Hint title="Some title" text={specialText} />);

            expect(screen.getByText(specialText)).toBeInTheDocument();
        });

        it("handles unicode characters", () => {
            const unicodeTitle = "Título con acentos";
            const unicodeText = "Texto con emojis 🎉 y caracteres especiales 世界";
            render(<Hint title={unicodeTitle} text={unicodeText} />);

            expect(screen.getByText(unicodeTitle)).toBeInTheDocument();
            expect(screen.getByText(unicodeText)).toBeInTheDocument();
        });
    });

    describe("Props Validation", () => {
        it("handles missing title prop", () => {
            // The component doesn't validate props at runtime, so this should not throw
            expect(() => {
                render(<Hint text="Some text" title="" />);
            }).not.toThrow();
        });

        it("handles missing text prop", () => {
            // The component doesn't validate props at runtime, so this should not throw
            expect(() => {
                render(<Hint title="Some title" text="" />);
            }).not.toThrow();
        });

        it("handles undefined title", () => {
            // The component doesn't validate props at runtime, so this should not throw
            expect(() => {
                render(<Hint title={undefined as any} text="Some text" />);
            }).not.toThrow();
        });

        it("handles undefined text", () => {
            // The component doesn't validate props at runtime, so this should not throw
            expect(() => {
                render(<Hint title="Some title" text={undefined as any} />);
            }).not.toThrow();
        });

        it("handles null title", () => {
            // The component doesn't validate props at runtime, so this should not throw
            expect(() => {
                render(<Hint title={null as any} text="Some text" />);
            }).not.toThrow();
        });

        it("handles null text", () => {
            // The component doesn't validate props at runtime, so this should not throw
            expect(() => {
                render(<Hint title="Some title" text={null as any} />);
            }).not.toThrow();
        });
    });

    describe("Component Structure", () => {
        it("renders all required elements", () => {
            render(<Hint {...defaultProps} />);

            // Icon
            expect(screen.getByTestId("icon-info")).toBeInTheDocument();
            // Title
            expect(screen.getByText("Test Title")).toBeInTheDocument();
            // Text
            expect(screen.getByText("This is a test hint message")).toBeInTheDocument();
        });

        it("maintains proper component hierarchy", () => {
            const { container } = render(<Hint {...defaultProps} />);

            // Should have a container with the hint content
            expect(container.firstChild).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("renders content that can be read by screen readers", () => {
            render(<Hint {...defaultProps} />);

            // Both title and text should be accessible
            expect(screen.getByText("Test Title")).toBeInTheDocument();
            expect(screen.getByText("This is a test hint message")).toBeInTheDocument();
        });

        it("provides visual hierarchy with title and text", () => {
            render(<Hint {...defaultProps} />);

            // Title should be distinct from text
            const title = screen.getByText("Test Title");
            const text = screen.getByText("This is a test hint message");
            
            expect(title).toBeInTheDocument();
            expect(text).toBeInTheDocument();
            expect(title).not.toBe(text);
        });
    });

    describe("Edge Cases", () => {
        it("handles very long content", () => {
            const veryLongTitle = "A".repeat(1000);
            const veryLongText = "B".repeat(1000);
            
            render(<Hint title={veryLongTitle} text={veryLongText} />);

            expect(screen.getByText(veryLongTitle)).toBeInTheDocument();
            expect(screen.getByText(veryLongText)).toBeInTheDocument();
        });

        it("handles HTML-like content", () => {
            const htmlTitle = "<script>alert('xss')</script>";
            const htmlText = "<div>HTML content</div>";
            
            render(<Hint title={htmlTitle} text={htmlText} />);

            // Should render as text, not execute HTML
            expect(screen.getByText(htmlTitle)).toBeInTheDocument();
            expect(screen.getByText(htmlText)).toBeInTheDocument();
        });

        it("handles whitespace-only content", () => {
            render(<Hint title="   " text="\t\n" />);

            // Check that the component renders without errors
            // The whitespace content is rendered but may be normalized by the browser
            const container = screen.getByTestId("icon-info").closest("div");
            expect(container).toBeInTheDocument();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<Hint {...defaultProps} />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<Hint {...defaultProps} />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<Hint title={`Title ${i}`} text={`Text ${i}`} />);
            }

            expect(screen.getByText("Title 9")).toBeInTheDocument();
            expect(screen.getByText("Text 9")).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<Hint {...defaultProps} />);

            expect(screen.getByText("Test Title")).toBeInTheDocument();

            unmount();

            // Component should be unmounted
            expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<Hint title={`Title ${i}`} text={`Text ${i}`} />);

                expect(screen.getByText(`Title ${i}`)).toBeInTheDocument();
                unmount();
            }

            // Should not have any memory leaks
            expect(screen.queryByText("Title 4")).not.toBeInTheDocument();
        });
    });
});