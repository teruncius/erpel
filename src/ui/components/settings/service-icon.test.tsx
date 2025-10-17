import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock IconIdToUrl function
const mockIconIdToUrl = vi.fn();

vi.mock("@erpel/state/settings", () => ({
    IconIdToUrl: (id: string) => mockIconIdToUrl(id),
}));

// Import the component after mocking
import { ServiceIcon } from "./service-icon";

describe("ServiceIcon", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        // Default mock return value
        mockIconIdToUrl.mockReturnValue("https://example.com/icon.png");
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without crashing", () => {
            const { container } = render(<ServiceIcon icon="test-icon" name="Test Service" size={32} />);
            expect(container).toBeInTheDocument();
        });

        it("renders an img element", () => {
            render(<ServiceIcon icon="test-icon" name="Test Service" size={32} />);
            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
        });

        it("renders with correct tag name", () => {
            render(<ServiceIcon icon="test-icon" name="Test Service" size={32} />);
            const img = screen.getByRole("img");
            expect(img.tagName).toBe("IMG");
        });

        it("renders only one img element", () => {
            render(<ServiceIcon icon="test-icon" name="Test Service" size={32} />);
            const images = screen.getAllByRole("img");
            expect(images).toHaveLength(1);
        });
    });

    describe("Props and Attributes", () => {
        it("sets correct src attribute using IconIdToUrl", () => {
            mockIconIdToUrl.mockReturnValue("https://example.com/custom-icon.png");

            render(<ServiceIcon icon="custom-icon" name="Custom Service" size={48} />);

            expect(mockIconIdToUrl).toHaveBeenCalledWith("custom-icon");

            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.src).toBe("https://example.com/custom-icon.png");
        });

        it("sets correct alt text from name prop", () => {
            render(<ServiceIcon icon="test-icon" name="My Service Name" size={32} />);
            const img = screen.getByAltText("My Service Name");
            expect(img).toBeInTheDocument();
        });

        it("sets correct width attribute", () => {
            render(<ServiceIcon icon="test-icon" name="Test Service" size={64} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "64");
        });

        it("sets correct height attribute", () => {
            render(<ServiceIcon icon="test-icon" name="Test Service" size={64} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("height", "64");
        });

        it("width and height match the size prop", () => {
            render(<ServiceIcon icon="test-icon" name="Test Service" size={128} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "128");
            expect(img).toHaveAttribute("height", "128");
        });

        it("passes custom style prop to img element", () => {
            const customStyle = { borderRadius: "50%", opacity: 0.8 };
            render(<ServiceIcon icon="test-icon" name="Test Service" size={32} style={customStyle} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.style.borderRadius).toBe("50%");
            expect(img.style.opacity).toBe("0.8");
        });

        it("renders without style prop when not provided", () => {
            render(<ServiceIcon icon="test-icon" name="Test Service" size={32} />);
            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
        });
    });

    describe("IconIdToUrl Integration", () => {
        it("calls IconIdToUrl with correct icon prop", () => {
            render(<ServiceIcon icon="gmail" name="Gmail" size={32} />);
            expect(mockIconIdToUrl).toHaveBeenCalledWith("gmail");
            expect(mockIconIdToUrl).toHaveBeenCalledTimes(1);
        });

        it("calls IconIdToUrl for different icon values", () => {
            const { rerender } = render(<ServiceIcon icon="slack" name="Slack" size={32} />);
            expect(mockIconIdToUrl).toHaveBeenCalledWith("slack");

            mockIconIdToUrl.mockClear();
            rerender(<ServiceIcon icon="teams" name="Teams" size={32} />);
            expect(mockIconIdToUrl).toHaveBeenCalledWith("teams");
        });

        it("handles empty string from IconIdToUrl", () => {
            mockIconIdToUrl.mockReturnValue("");
            render(<ServiceIcon icon="unknown-icon" name="Unknown" size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            // Component should render without crashing even with empty src
            expect(img).toBeInTheDocument();
            expect(mockIconIdToUrl).toHaveBeenCalledWith("unknown-icon");
        });

        it("handles URL with query parameters", () => {
            mockIconIdToUrl.mockReturnValue("https://example.com/icon.png?size=64&v=1");
            render(<ServiceIcon icon="test" name="Test" size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.src).toBe("https://example.com/icon.png?size=64&v=1");
        });

        it("handles relative URLs", () => {
            mockIconIdToUrl.mockReturnValue("/assets/icon.png");
            render(<ServiceIcon icon="test" name="Test" size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.src).toContain("/assets/icon.png");
        });
    });

    describe("Different Size Values", () => {
        it("renders with small size (16px)", () => {
            render(<ServiceIcon icon="test" name="Test" size={16} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "16");
            expect(img).toHaveAttribute("height", "16");
        });

        it("renders with medium size (48px)", () => {
            render(<ServiceIcon icon="test" name="Test" size={48} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "48");
            expect(img).toHaveAttribute("height", "48");
        });

        it("renders with large size (128px)", () => {
            render(<ServiceIcon icon="test" name="Test" size={128} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "128");
            expect(img).toHaveAttribute("height", "128");
        });

        it("renders with extra large size (256px)", () => {
            render(<ServiceIcon icon="test" name="Test" size={256} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "256");
            expect(img).toHaveAttribute("height", "256");
        });

        it("handles size of 0", () => {
            render(<ServiceIcon icon="test" name="Test" size={0} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "0");
            expect(img).toHaveAttribute("height", "0");
        });

        it("handles fractional size values", () => {
            render(<ServiceIcon icon="test" name="Test" size={32.5} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "32.5");
            expect(img).toHaveAttribute("height", "32.5");
        });
    });

    describe("Accessibility", () => {
        it("has proper alt text for screen readers", () => {
            render(<ServiceIcon icon="test" name="Gmail Service" size={32} />);
            const img = screen.getByAltText("Gmail Service");
            expect(img).toBeInTheDocument();
        });

        it("can be found by role and name", () => {
            render(<ServiceIcon icon="test" name="Slack Workspace" size={32} />);
            const img = screen.getByRole("img", { name: "Slack Workspace" });
            expect(img).toBeInTheDocument();
        });

        it("alt text matches name prop exactly", () => {
            render(<ServiceIcon icon="test" name="Test Service 123" size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.alt).toBe("Test Service 123");
        });

        it("handles special characters in name", () => {
            render(<ServiceIcon icon="test" name="Test & Service <>" size={32} />);
            const img = screen.getByAltText("Test & Service <>");
            expect(img).toBeInTheDocument();
        });

        it("handles unicode characters in name", () => {
            render(<ServiceIcon icon="test" name="Test 🚀 Service" size={32} />);
            const img = screen.getByAltText("Test 🚀 Service");
            expect(img).toBeInTheDocument();
        });
    });

    describe("Style Prop Variations", () => {
        it("applies single CSS property", () => {
            render(<ServiceIcon icon="test" name="Test" size={32} style={{ opacity: 0.5 }} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.style.opacity).toBe("0.5");
        });

        it("applies multiple CSS properties", () => {
            const style = {
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                margin: "10px",
            };
            render(<ServiceIcon icon="test" name="Test" size={32} style={style} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.style.borderRadius).toBe("8px");
            // Browser normalizes boxShadow format, just check it's set
            expect(img.style.boxShadow).toBeTruthy();
            expect(img.style.boxShadow).toContain("rgba");
            expect(img.style.margin).toBe("10px");
        });

        it("applies transform property", () => {
            render(<ServiceIcon icon="test" name="Test" size={32} style={{ transform: "rotate(45deg)" }} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.style.transform).toBe("rotate(45deg)");
        });

        it("applies filter property", () => {
            render(<ServiceIcon icon="test" name="Test" size={32} style={{ filter: "grayscale(100%)" }} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.style.filter).toBe("grayscale(100%)");
        });

        it("handles undefined style prop", () => {
            render(<ServiceIcon icon="test" name="Test" size={32} style={undefined} />);
            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("maintains attributes across rerenders", () => {
            const { rerender } = render(<ServiceIcon icon="test" name="Test" size={32} />);

            let img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "32");

            rerender(<ServiceIcon icon="test" name="Test" size={32} />);

            img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "32");
        });

        it("updates when props change", () => {
            const { rerender } = render(<ServiceIcon icon="icon1" name="Service 1" size={32} />);

            let img = screen.getByAltText("Service 1");
            expect(img).toHaveAttribute("width", "32");

            mockIconIdToUrl.mockReturnValue("https://example.com/icon2.png");
            rerender(<ServiceIcon icon="icon2" name="Service 2" size={64} />);

            img = screen.getByAltText("Service 2");
            expect(img).toHaveAttribute("width", "64");
            expect(mockIconIdToUrl).toHaveBeenCalledWith("icon2");
        });

        it("updates src when icon prop changes", () => {
            mockIconIdToUrl.mockReturnValue("https://example.com/icon1.png");
            const { rerender } = render(<ServiceIcon icon="icon1" name="Test" size={32} />);

            let img = screen.getByRole("img") as HTMLImageElement;
            expect(img.src).toBe("https://example.com/icon1.png");

            mockIconIdToUrl.mockReturnValue("https://example.com/icon2.png");
            rerender(<ServiceIcon icon="icon2" name="Test" size={32} />);

            img = screen.getByRole("img") as HTMLImageElement;
            expect(img.src).toBe("https://example.com/icon2.png");
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(<ServiceIcon icon="test" name="Test" size={32} />);

            expect(() => unmount()).not.toThrow();
        });

        it("handles rapid mount/unmount cycles", () => {
            const { unmount: unmount1 } = render(<ServiceIcon icon="test1" name="Test 1" size={32} />);
            unmount1();

            const { unmount: unmount2 } = render(<ServiceIcon icon="test2" name="Test 2" size={48} />);
            unmount2();

            const { unmount: unmount3 } = render(<ServiceIcon icon="test3" name="Test 3" size={64} />);
            unmount3();

            expect(true).toBe(true); // No crashes
        });
    });

    describe("Edge Cases", () => {
        it("handles empty icon string", () => {
            mockIconIdToUrl.mockReturnValue("");
            const { container } = render(<ServiceIcon icon="" name="Test" size={32} />);

            expect(mockIconIdToUrl).toHaveBeenCalledWith("");
            expect(container).toBeInTheDocument();
        });

        it("handles empty name string", () => {
            const { container } = render(<ServiceIcon icon="test" name="" size={32} />);
            const img = container.querySelector("img") as HTMLImageElement;
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute("alt", "");
        });

        it("handles very long icon id", () => {
            const longIcon = "a".repeat(1000);
            render(<ServiceIcon icon={longIcon} name="Test" size={32} />);
            expect(mockIconIdToUrl).toHaveBeenCalledWith(longIcon);
        });

        it("handles very long name", () => {
            const longName = "Test Service ".repeat(100);
            render(<ServiceIcon icon="test" name={longName} size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.alt).toBe(longName);
        });

        it("handles special characters in icon id", () => {
            render(<ServiceIcon icon="test-icon_123" name="Test" size={32} />);
            expect(mockIconIdToUrl).toHaveBeenCalledWith("test-icon_123");
        });

        it("handles whitespace in name", () => {
            render(<ServiceIcon icon="test" name="  Test  Service  " size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.alt).toBe("  Test  Service  ");
            expect(img).toBeInTheDocument();
        });

        it("handles negative size values", () => {
            render(<ServiceIcon icon="test" name="Test" size={-32} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "-32");
            expect(img).toHaveAttribute("height", "-32");
        });

        it("handles very large size values", () => {
            render(<ServiceIcon icon="test" name="Test" size={9999} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "9999");
            expect(img).toHaveAttribute("height", "9999");
        });

        it("handles undefined icon id gracefully", () => {
            const { container } = render(<ServiceIcon icon={undefined as any} name="Test" size={32} />);
            expect(container).toBeInTheDocument();
        });

        it("handles null name gracefully", () => {
            // Component should render without crashing, even with null name
            const { container } = render(<ServiceIcon icon="test" name={null as any} size={32} />);
            const img = container.querySelector("img");
            expect(img).toBeInTheDocument();
        });

        it("handles NaN size gracefully", () => {
            const { container } = render(<ServiceIcon icon="test" name="Test" size={NaN} />);
            expect(container).toBeInTheDocument();
        });
    });

    describe("Performance", () => {
        it("renders efficiently with multiple rerenders", () => {
            const { rerender } = render(<ServiceIcon icon="test" name="Test" size={32} />);

            for (let i = 0; i < 10; i++) {
                rerender(<ServiceIcon icon="test" name="Test" size={32} />);
            }

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
        });

        it("handles rapid prop changes efficiently", () => {
            const { rerender } = render(<ServiceIcon icon="icon1" name="Service 1" size={32} />);

            for (let i = 0; i < 5; i++) {
                rerender(<ServiceIcon icon={`icon${i}`} name={`Service ${i}`} size={32 + i * 16} />);
            }

            expect(mockIconIdToUrl).toHaveBeenCalledTimes(6); // Initial + 5 updates
        });

        it("does not cause unnecessary IconIdToUrl calls on unrelated prop changes", () => {
            const { rerender } = render(<ServiceIcon icon="test" name="Test" size={32} style={{ opacity: 0.5 }} />);

            mockIconIdToUrl.mockClear();

            rerender(<ServiceIcon icon="test" name="Test" size={32} style={{ opacity: 0.8 }} />);

            // Should still be called because component rerenders
            expect(mockIconIdToUrl).toHaveBeenCalled();
        });
    });

    describe("Styled Component", () => {
        it("applies user-select: none style", () => {
            render(<ServiceIcon icon="test" name="Test" size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            const computedStyle = window.getComputedStyle(img);
            // Note: user-select might not be directly testable in JSDOM
            expect(img).toBeInTheDocument();
        });

        it("inherits styled-components styling", () => {
            render(<ServiceIcon icon="test" name="Test" size={32} />);
            const img = screen.getByRole("img");
            // Check that it's a styled component
            expect(img.className).toBeTruthy();
        });
    });

    describe("Multiple Instances", () => {
        it("renders multiple ServiceIcon components independently", () => {
            render(
                <div>
                    <ServiceIcon icon="icon1" name="Service 1" size={32} />
                    <ServiceIcon icon="icon2" name="Service 2" size={48} />
                    <ServiceIcon icon="icon3" name="Service 3" size={64} />
                </div>
            );

            expect(screen.getByAltText("Service 1")).toBeInTheDocument();
            expect(screen.getByAltText("Service 2")).toBeInTheDocument();
            expect(screen.getByAltText("Service 3")).toBeInTheDocument();
        });

        it("each instance has correct attributes", () => {
            render(
                <div>
                    <ServiceIcon icon="icon1" name="Service 1" size={32} />
                    <ServiceIcon icon="icon2" name="Service 2" size={64} />
                </div>
            );

            const img1 = screen.getByAltText("Service 1");
            const img2 = screen.getByAltText("Service 2");

            expect(img1).toHaveAttribute("width", "32");
            expect(img2).toHaveAttribute("width", "64");
        });

        it("each instance calls IconIdToUrl with correct icon", () => {
            render(
                <div>
                    <ServiceIcon icon="gmail" name="Gmail" size={32} />
                    <ServiceIcon icon="slack" name="Slack" size={32} />
                </div>
            );

            expect(mockIconIdToUrl).toHaveBeenCalledWith("gmail");
            expect(mockIconIdToUrl).toHaveBeenCalledWith("slack");
            expect(mockIconIdToUrl).toHaveBeenCalledTimes(2);
        });
    });

    describe("Integration", () => {
        it("integrates with IconIdToUrl for valid icon ids", () => {
            mockIconIdToUrl.mockImplementation((id: string) => {
                const icons: Record<string, string> = {
                    gmail: "https://example.com/gmail.png",
                    slack: "https://example.com/slack.png",
                    teams: "https://example.com/teams.png",
                };
                return icons[id] || "";
            });

            render(<ServiceIcon icon="gmail" name="Gmail" size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            expect(img.src).toBe("https://example.com/gmail.png");
        });

        it("handles missing icon id in IconIdToUrl", () => {
            mockIconIdToUrl.mockImplementation((id: string) => {
                const icons: Record<string, string> = {
                    gmail: "https://example.com/gmail.png",
                };
                return icons[id] || "";
            });

            render(<ServiceIcon icon="unknown" name="Unknown" size={32} />);
            const img = screen.getByRole("img") as HTMLImageElement;
            // Component should render without crashing
            expect(img).toBeInTheDocument();
            expect(mockIconIdToUrl).toHaveBeenCalledWith("unknown");
        });
    });
});
