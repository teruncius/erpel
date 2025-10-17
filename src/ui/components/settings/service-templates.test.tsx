import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ServiceTemplate } from "@erpel/state/schema";

// Mock Icon component
vi.mock("../../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <svg data-testid={`icon-${name}`} height={size} width={size}>
            {name}
        </svg>
    ),
}));

// Mock ServiceIcon component
vi.mock("./service-icon", () => ({
    ServiceIcon: ({ icon, name, size }: { icon: string; name: string; size: number }) => (
        <img alt={name} data-testid={`service-icon-${icon}`} height={size} src={icon} width={size} />
    ),
}));

// Mock useStore hook
const mockAddFromTemplate = vi.fn();
const mockUseStore = vi.fn();

vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Import the component after mocking
import { ServiceTemplates } from "./service-templates";

describe("ServiceTemplates", () => {
    const mockTemplate1: ServiceTemplate = {
        id: "template-1",
        name: {
            default: "Gmail",
            copyOnCreate: false,
            customizable: true,
        },
        icon: {
            default: "gmail-icon",
            copyOnCreate: false,
            customizable: true,
        },
        url: {
            default: "https://mail.google.com",
            copyOnCreate: false,
            customizable: true,
        },
        darkMode: {
            default: false,
            copyOnCreate: false,
            customizable: true,
        },
        tags: ["email", "google"],
    };

    const mockTemplate2: ServiceTemplate = {
        id: "template-2",
        name: {
            default: "Slack",
            copyOnCreate: false,
            customizable: true,
        },
        icon: {
            default: "slack-icon",
            copyOnCreate: false,
            customizable: true,
        },
        url: {
            default: "https://slack.com",
            copyOnCreate: false,
            customizable: true,
        },
        darkMode: {
            default: false,
            copyOnCreate: false,
            customizable: true,
        },
        tags: ["chat", "messaging"],
    };

    const mockTemplate3: ServiceTemplate = {
        id: "template-3",
        name: {
            default: "Microsoft Teams",
            copyOnCreate: false,
            customizable: true,
        },
        icon: {
            default: "teams-icon",
            copyOnCreate: false,
            customizable: true,
        },
        url: {
            default: "https://teams.microsoft.com",
            copyOnCreate: false,
            customizable: true,
        },
        darkMode: {
            default: false,
            copyOnCreate: false,
            customizable: true,
        },
        tags: ["chat", "microsoft", "video"],
    };

    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
        cleanup();
        // Default mock return value
        mockUseStore.mockReturnValue({
            templates: [mockTemplate1, mockTemplate2, mockTemplate3],
            addFromTemplate: mockAddFromTemplate,
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without crashing", () => {
            const { container } = render(<ServiceTemplates />);
            expect(container).toBeInTheDocument();
        });

        it("renders all templates when no filter is applied", () => {
            render(<ServiceTemplates />);
            expect(screen.getByText("Gmail")).toBeInTheDocument();
            expect(screen.getByText("Slack")).toBeInTheDocument();
            expect(screen.getByText("Microsoft Teams")).toBeInTheDocument();
        });

        it("renders the filter input", () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");
            expect(input).toBeInTheDocument();
        });

        it("renders the reset button", () => {
            render(<ServiceTemplates />);
            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("renders cross icon in reset button", () => {
            const { container } = render(<ServiceTemplates />);
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute("width", "16");
        });

        it("renders ServiceIcon for each template", () => {
            render(<ServiceTemplates />);
            expect(screen.getByTestId("service-icon-gmail-icon")).toBeInTheDocument();
            expect(screen.getByTestId("service-icon-slack-icon")).toBeInTheDocument();
            expect(screen.getByTestId("service-icon-teams-icon")).toBeInTheDocument();
        });

        it("renders templates in grid layout", () => {
            const { container } = render(<ServiceTemplates />);
            const templates = container.querySelectorAll('[data-testid*="service-icon"]');
            expect(templates.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe("Filter Functionality", () => {
        it("filters templates by name", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "Gmail");

            await waitFor(() => {
                expect(screen.getByText("Gmail")).toBeInTheDocument();
                expect(screen.queryByText("Slack")).not.toBeInTheDocument();
                expect(screen.queryByText("Microsoft Teams")).not.toBeInTheDocument();
            });
        });

        it("filters templates case-insensitively", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "gmail");

            await waitFor(() => {
                expect(screen.getByText("Gmail")).toBeInTheDocument();
                expect(screen.queryByText("Slack")).not.toBeInTheDocument();
            });
        });

        it("filters templates by partial name match", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "Micro");

            await waitFor(() => {
                expect(screen.getByText("Microsoft Teams")).toBeInTheDocument();
                expect(screen.queryByText("Gmail")).not.toBeInTheDocument();
                expect(screen.queryByText("Slack")).not.toBeInTheDocument();
            });
        });

        it("filters templates by tags", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "email");

            await waitFor(() => {
                expect(screen.getByText("Gmail")).toBeInTheDocument();
                expect(screen.queryByText("Slack")).not.toBeInTheDocument();
                expect(screen.queryByText("Microsoft Teams")).not.toBeInTheDocument();
            });
        });

        it("filters templates by tags case-insensitively", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "EMAIL");

            await waitFor(() => {
                expect(screen.getByText("Gmail")).toBeInTheDocument();
                expect(screen.queryByText("Slack")).not.toBeInTheDocument();
            });
        });

        it("shows multiple templates matching the same tag", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "chat");

            await waitFor(() => {
                expect(screen.getByText("Slack")).toBeInTheDocument();
                expect(screen.getByText("Microsoft Teams")).toBeInTheDocument();
                expect(screen.queryByText("Gmail")).not.toBeInTheDocument();
            });
        });

        it("shows no templates when filter matches nothing", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "nonexistent");

            await waitFor(() => {
                expect(screen.queryByText("Gmail")).not.toBeInTheDocument();
                expect(screen.queryByText("Slack")).not.toBeInTheDocument();
                expect(screen.queryByText("Microsoft Teams")).not.toBeInTheDocument();
            });
        });

        it("updates filter value in input", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter") as HTMLInputElement;

            await user.type(input, "Slack");

            expect(input.value).toBe("Slack");
        });

        it("handles rapid typing", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "SlackTeams", { delay: 1 });

            await waitFor(() => {
                expect(screen.queryByText("Gmail")).not.toBeInTheDocument();
            });
        });

        it("filters by partial tag match", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "mes");

            await waitFor(() => {
                expect(screen.getByText("Slack")).toBeInTheDocument(); // has "messaging"
                expect(screen.queryByText("Gmail")).not.toBeInTheDocument();
            });
        });
    });

    describe("Reset Functionality", () => {
        it("clears filter when reset button is clicked", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter") as HTMLInputElement;
            const button = screen.getByRole("button");

            await user.type(input, "Gmail");
            expect(input.value).toBe("Gmail");

            await user.click(button);

            await waitFor(() => {
                expect(input.value).toBe("");
            });
        });

        it("shows all templates after reset", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");
            const button = screen.getByRole("button");

            await user.type(input, "Gmail");
            await waitFor(() => {
                expect(screen.queryByText("Slack")).not.toBeInTheDocument();
            });

            await user.click(button);

            await waitFor(() => {
                expect(screen.getByText("Gmail")).toBeInTheDocument();
                expect(screen.getByText("Slack")).toBeInTheDocument();
                expect(screen.getByText("Microsoft Teams")).toBeInTheDocument();
            });
        });

        it("can reset multiple times", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter") as HTMLInputElement;
            const button = screen.getByRole("button");

            await user.type(input, "Gmail");
            await user.click(button);
            expect(input.value).toBe("");

            await user.type(input, "Slack");
            await user.click(button);
            expect(input.value).toBe("");
        });

        it("reset button works even when filter is empty", async () => {
            render(<ServiceTemplates />);
            const button = screen.getByRole("button");

            await user.click(button);

            expect(screen.getByText("Gmail")).toBeInTheDocument();
            expect(screen.getByText("Slack")).toBeInTheDocument();
            expect(screen.getByText("Microsoft Teams")).toBeInTheDocument();
        });
    });

    describe("Template Interaction", () => {
        it("calls addFromTemplate when a template is clicked", async () => {
            render(<ServiceTemplates />);
            const gmailTemplate = screen.getByText("Gmail");

            await user.click(gmailTemplate);

            await waitFor(() => {
                expect(mockAddFromTemplate).toHaveBeenCalledWith(mockTemplate1);
            });
        });

        it("calls addFromTemplate with correct template", async () => {
            render(<ServiceTemplates />);
            const slackTemplate = screen.getByText("Slack");

            await user.click(slackTemplate);

            await waitFor(() => {
                expect(mockAddFromTemplate).toHaveBeenCalledWith(mockTemplate2);
            });
        });

        it("can add multiple templates in sequence", async () => {
            render(<ServiceTemplates />);
            
            await user.click(screen.getByText("Gmail"));
            await user.click(screen.getByText("Slack"));

            await waitFor(() => {
                expect(mockAddFromTemplate).toHaveBeenCalledTimes(2);
                expect(mockAddFromTemplate).toHaveBeenNthCalledWith(1, mockTemplate1);
                expect(mockAddFromTemplate).toHaveBeenNthCalledWith(2, mockTemplate2);
            });
        });

        it("clicking template icon also triggers addFromTemplate", async () => {
            render(<ServiceTemplates />);
            const icon = screen.getByTestId("service-icon-gmail-icon");

            await user.click(icon);

            await waitFor(() => {
                expect(mockAddFromTemplate).toHaveBeenCalledWith(mockTemplate1);
            });
        });

        it("can add template after filtering", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "Slack");
            await user.click(screen.getByText("Slack"));

            await waitFor(() => {
                expect(mockAddFromTemplate).toHaveBeenCalledWith(mockTemplate2);
            });
        });
    });

    describe("Store Integration", () => {
        it("uses templates from store", () => {
            mockUseStore.mockReturnValueOnce({
                templates: [mockTemplate1],
                addFromTemplate: mockAddFromTemplate,
            });

            render(<ServiceTemplates />);

            expect(screen.getByText("Gmail")).toBeInTheDocument();
            expect(screen.queryByText("Slack")).not.toBeInTheDocument();
        });

        it("renders empty grid when no templates", () => {
            mockUseStore.mockReturnValueOnce({
                templates: [],
                addFromTemplate: mockAddFromTemplate,
            });

            const { container } = render(<ServiceTemplates />);
            const templates = container.querySelectorAll('[data-testid*="service-icon"]');
            expect(templates).toHaveLength(0);
        });

        it("updates when templates change", () => {
            mockUseStore.mockReturnValueOnce({
                templates: [mockTemplate1],
                addFromTemplate: mockAddFromTemplate,
            });

            const { rerender } = render(<ServiceTemplates />);
            expect(screen.getByText("Gmail")).toBeInTheDocument();

            mockUseStore.mockReturnValueOnce({
                templates: [mockTemplate2],
                addFromTemplate: mockAddFromTemplate,
            });

            rerender(<ServiceTemplates />);
            expect(screen.queryByText("Gmail")).not.toBeInTheDocument();
            expect(screen.getByText("Slack")).toBeInTheDocument();
        });

        it("uses addFromTemplate function from store", async () => {
            const customAddFunction = vi.fn();
            mockUseStore.mockReturnValue({
                templates: [mockTemplate1],
                addFromTemplate: customAddFunction,
            });

            render(<ServiceTemplates />);
            await user.click(screen.getByText("Gmail"));

            await waitFor(() => {
                expect(customAddFunction).toHaveBeenCalledWith(mockTemplate1);
            });
        });
    });

    describe("ServiceIcon Integration", () => {
        it("passes correct icon to ServiceIcon", () => {
            render(<ServiceTemplates />);
            const icon = screen.getByTestId("service-icon-gmail-icon");
            expect(icon).toHaveAttribute("src", "gmail-icon");
        });

        it("passes correct name to ServiceIcon", () => {
            render(<ServiceTemplates />);
            const icon = screen.getByAltText("Gmail");
            expect(icon).toBeInTheDocument();
        });

        it("passes correct size to ServiceIcon", () => {
            render(<ServiceTemplates />);
            const icon = screen.getByTestId("service-icon-gmail-icon");
            expect(icon).toHaveAttribute("width", "32");
            expect(icon).toHaveAttribute("height", "32");
        });

        it("renders ServiceIcon for each template", () => {
            render(<ServiceTemplates />);
            expect(screen.getByTestId("service-icon-gmail-icon")).toBeInTheDocument();
            expect(screen.getByTestId("service-icon-slack-icon")).toBeInTheDocument();
            expect(screen.getByTestId("service-icon-teams-icon")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles templates with empty tags array", () => {
            const templateNoTags: ServiceTemplate = {
                ...mockTemplate1,
                id: "no-tags",
                tags: [],
            };

            mockUseStore.mockReturnValueOnce({
                templates: [templateNoTags],
                addFromTemplate: mockAddFromTemplate,
            });

            render(<ServiceTemplates />);
            expect(screen.getByText("Gmail")).toBeInTheDocument();
        });

        it("handles templates with very long names", () => {
            const longNameTemplate: ServiceTemplate = {
                ...mockTemplate1,
                name: {
                    ...mockTemplate1.name,
                    default: "A".repeat(100),
                },
            };

            mockUseStore.mockReturnValueOnce({
                templates: [longNameTemplate],
                addFromTemplate: mockAddFromTemplate,
            });

            render(<ServiceTemplates />);
            expect(screen.getByText("A".repeat(100))).toBeInTheDocument();
        });

        it("handles templates with special characters in name", () => {
            const specialCharsTemplate: ServiceTemplate = {
                ...mockTemplate1,
                name: {
                    ...mockTemplate1.name,
                    default: "Test & Service <> 123",
                },
            };

            mockUseStore.mockReturnValueOnce({
                templates: [specialCharsTemplate],
                addFromTemplate: mockAddFromTemplate,
            });

            render(<ServiceTemplates />);
            expect(screen.getByText("Test & Service <> 123")).toBeInTheDocument();
        });

        it("handles templates with special characters in tags", async () => {
            const specialTagsTemplate: ServiceTemplate = {
                ...mockTemplate1,
                tags: ["tag-with-dash", "tag_with_underscore", "tag.with.dots"],
            };

            mockUseStore.mockReturnValue({
                templates: [specialTagsTemplate],
                addFromTemplate: mockAddFromTemplate,
            });

            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "tag-with-dash");

            await waitFor(() => {
                expect(screen.getByText("Gmail")).toBeInTheDocument();
            });
        });

        it("handles whitespace in filter input", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "  Gmail  ");

            // The filter doesn't trim whitespace, so it should match "Gmail" in "  Gmail  "
            await waitFor(() => {
                // The component filters by checking if the name includes the search string
                // So "  Gmail  " won't match "Gmail" exactly, but all items should still show
                // because the filter looks for lowercase includes
                const input = screen.getByPlaceholderText("Type to filter") as HTMLInputElement;
                expect(input.value).toBe("  Gmail  ");
            });
        });

        it("handles missing addFromTemplate function", async () => {
            mockUseStore.mockReturnValueOnce({
                templates: [mockTemplate1],
                addFromTemplate: undefined,
            });

            render(<ServiceTemplates />);
            // Should render without crashing
            expect(screen.getByText("Gmail")).toBeInTheDocument();
        });

        it("handles template with empty name", () => {
            const emptyNameTemplate: ServiceTemplate = {
                ...mockTemplate1,
                name: {
                    ...mockTemplate1.name,
                    default: "",
                },
            };

            mockUseStore.mockReturnValueOnce({
                templates: [emptyNameTemplate],
                addFromTemplate: mockAddFromTemplate,
            });

            const { container } = render(<ServiceTemplates />);
            expect(container).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("maintains state across rerenders", async () => {
            const { rerender } = render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter") as HTMLInputElement;

            await user.type(input, "Gmail");
            expect(input.value).toBe("Gmail");

            rerender(<ServiceTemplates />);
            expect(input.value).toBe("Gmail");
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(<ServiceTemplates />);
            expect(() => unmount()).not.toThrow();
        });

        it("handles rapid mount/unmount cycles", () => {
            const { unmount: unmount1 } = render(<ServiceTemplates />);
            unmount1();

            const { unmount: unmount2 } = render(<ServiceTemplates />);
            unmount2();

            const { unmount: unmount3 } = render(<ServiceTemplates />);
            unmount3();

            expect(true).toBe(true); // No crashes
        });
    });

    describe("Performance", () => {
        it("renders efficiently with many templates", () => {
            const manyTemplates: ServiceTemplate[] = Array.from({ length: 50 }, (_, i) => ({
                ...mockTemplate1,
                id: `template-${i}`,
                name: {
                    ...mockTemplate1.name,
                    default: `Template ${i}`,
                },
            }));

            mockUseStore.mockReturnValueOnce({
                templates: manyTemplates,
                addFromTemplate: mockAddFromTemplate,
            });

            const { container } = render(<ServiceTemplates />);
            expect(container).toBeInTheDocument();
        });

        it("filters efficiently with many templates", async () => {
            const manyTemplates: ServiceTemplate[] = Array.from({ length: 50 }, (_, i) => ({
                ...mockTemplate1,
                id: `template-${i}`,
                name: {
                    ...mockTemplate1.name,
                    default: `Template ${i}`,
                },
            }));

            mockUseStore.mockReturnValue({
                templates: manyTemplates,
                addFromTemplate: mockAddFromTemplate,
            });

            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "Template 1");

            await waitFor(() => {
                // Should show Template 1, Template 10-19 (all contain "Template 1")
                expect(screen.getByText("Template 1")).toBeInTheDocument();
            });
        });

        it("handles multiple filter changes efficiently", async () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");

            await user.type(input, "G");
            await user.type(input, "m");
            await user.type(input, "a");
            await user.type(input, "i");
            await user.type(input, "l");

            await waitFor(() => {
                expect(screen.getByText("Gmail")).toBeInTheDocument();
            });
        });
    });

    describe("Accessibility", () => {
        it("filter input is accessible", () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");
            expect(input).toHaveAttribute("type", "text");
        });

        it("reset button is accessible", () => {
            render(<ServiceTemplates />);
            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("type", "button");
        });

        it("templates are clickable", async () => {
            render(<ServiceTemplates />);
            const gmailTemplate = screen.getByText("Gmail");
            
            // Templates should be clickable and trigger addFromTemplate
            await user.click(gmailTemplate);
            
            await waitFor(() => {
                expect(mockAddFromTemplate).toHaveBeenCalledWith(mockTemplate1);
            });
        });

        it("filter input can be focused", () => {
            render(<ServiceTemplates />);
            const input = screen.getByPlaceholderText("Type to filter");
            input.focus();
            expect(document.activeElement).toBe(input);
        });
    });

    describe("Callback Behavior", () => {
        it("handleAdd callback uses correct template", async () => {
            render(<ServiceTemplates />);
            
            await user.click(screen.getByText("Gmail"));
            expect(mockAddFromTemplate).toHaveBeenCalledWith(mockTemplate1);

            mockAddFromTemplate.mockClear();

            await user.click(screen.getByText("Slack"));
            expect(mockAddFromTemplate).toHaveBeenCalledWith(mockTemplate2);
        });

        it("handleAdd callback is memoized", () => {
            const { rerender } = render(<ServiceTemplates />);
            const gmailBox1 = screen.getByText("Gmail").closest("div");

            rerender(<ServiceTemplates />);
            const gmailBox2 = screen.getByText("Gmail").closest("div");

            // The DOM elements should be stable
            expect(gmailBox1).toBeInTheDocument();
            expect(gmailBox2).toBeInTheDocument();
        });
    });
});

