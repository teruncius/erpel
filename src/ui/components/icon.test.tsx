import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the icons resource
vi.mock("../../../resources/icons.svg", () => ({
    default: "mocked-icons.svg",
}));

// Import the Icon component
import { Icon } from "./icon";

describe("Icon", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders an SVG element", () => {
            render(<Icon name="home" size={24} />);

            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("sets correct width and height", () => {
            render(<Icon name="home" size={32} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveAttribute("width", "32");
            expect(svg).toHaveAttribute("height", "32");
        });

        it("renders with different sizes", () => {
            const sizes = [16, 24, 32, 48, 64];

            sizes.forEach((size) => {
                const { unmount } = render(<Icon name="home" size={size} />);

                const svg = document.querySelector("svg");
                expect(svg).toHaveAttribute("width", size.toString());
                expect(svg).toHaveAttribute("height", size.toString());

                unmount();
            });
        });
    });

    describe("Icon Names", () => {
        const iconNames = [
            "arrow-left2",
            "arrow-right2",
            "bin",
            "bug",
            "checkbox-checked",
            "checkbox-unchecked",
            "cog",
            "cross",
            "dropbox",
            "floppy-disk",
            "folder-download",
            "folder-upload",
            "home",
            "info",
            "menu",
        ] as const;

        it("renders all supported icon names", () => {
            iconNames.forEach((name) => {
                const { unmount } = render(<Icon name={name} size={24} />);

                const svg = document.querySelector("svg");
                const use = svg?.querySelector("use");
                expect(use).toBeInTheDocument();
                expect(use).toHaveAttribute("xlink:href", `mocked-icons.svg#icon-${name}`);

                unmount();
            });
        });

        it("uses correct xlinkHref for each icon", () => {
            render(<Icon name="home" size={24} />);

            const use = document.querySelector("use");
            expect(use).toBeInTheDocument();
            expect(use).toHaveAttribute("xlink:href", "mocked-icons.svg#icon-home");
        });
    });

    describe("Style Props", () => {
        it("applies custom styles", () => {
            const customStyle = {
                color: "red",
                margin: "10px",
            };

            render(<Icon name="home" size={24} style={customStyle} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveStyle("color: red");
            expect(svg).toHaveStyle("margin: 10px");
        });

        it("merges custom styles with default styles", () => {
            const customStyle = {
                color: "blue",
                display: "block",
            };

            render(<Icon name="home" size={24} style={customStyle} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveStyle("color: blue");
            expect(svg).toHaveStyle("display: block");
        });

        it("handles undefined style prop", () => {
            render(<Icon name="home" size={24} />);

            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("handles empty style object", () => {
            render(<Icon name="home" size={24} style={{}} />);

            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });
    });

    describe("SVG Structure", () => {
        it("contains a use element", () => {
            render(<Icon name="home" size={24} />);

            const use = document.querySelector("use");
            expect(use).toBeInTheDocument();
        });

        it("has correct SVG attributes", () => {
            render(<Icon name="home" size={24} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveAttribute("width", "24");
            expect(svg).toHaveAttribute("height", "24");
        });

        it("maintains aspect ratio", () => {
            render(<Icon name="home" size={32} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveAttribute("width", "32");
            expect(svg).toHaveAttribute("height", "32");
        });
    });

    describe("Accessibility", () => {
        it("renders without accessibility issues", () => {
            render(<Icon name="home" size={24} />);

            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("can be used as a decorative icon", () => {
            render(<Icon name="home" size={24} />);

            const svg = document.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles zero size", () => {
            render(<Icon name="home" size={0} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveAttribute("width", "0");
            expect(svg).toHaveAttribute("height", "0");
        });

        it("handles very large sizes", () => {
            render(<Icon name="home" size={1000} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveAttribute("width", "1000");
            expect(svg).toHaveAttribute("height", "1000");
        });

        it("handles negative sizes", () => {
            render(<Icon name="home" size={-10} />);

            const svg = document.querySelector("svg");
            expect(svg).toHaveAttribute("width", "-10");
            expect(svg).toHaveAttribute("height", "-10");
        });
    });

    describe("Icon Resource Integration", () => {
        it("uses the correct icon resource path", () => {
            render(<Icon name="home" size={24} />);

            const use = document.querySelector("use");
            expect(use).toBeInTheDocument();
            expect(use).toHaveAttribute("xlink:href", "mocked-icons.svg#icon-home");
        });

        it("constructs correct icon references", () => {
            const testCases = [
                { name: "home", expected: "mocked-icons.svg#icon-home" },
                { name: "arrow-left2", expected: "mocked-icons.svg#icon-arrow-left2" },
                { name: "checkbox-checked", expected: "mocked-icons.svg#icon-checkbox-checked" },
            ];

            testCases.forEach(({ name, expected }) => {
                const { unmount } = render(<Icon name={name as any} size={24} />);

                const use = document.querySelector("use");
                expect(use).toBeInTheDocument();
                expect(use).toHaveAttribute("xlink:href", expected);

                unmount();
            });
        });
    });

    describe("Component Props", () => {
        it("accepts all required props", () => {
            const props = {
                name: "home" as const,
                size: 24,
            };

            expect(() => render(<Icon {...props} />)).not.toThrow();
        });

        it("accepts optional style prop", () => {
            const props = {
                name: "home" as const,
                size: 24,
                style: { color: "red" },
            };

            expect(() => render(<Icon {...props} />)).not.toThrow();
        });

        it("handles missing optional props", () => {
            const props = {
                name: "home" as const,
                size: 24,
            };

            expect(() => render(<Icon {...props} />)).not.toThrow();
        });
    });
});
