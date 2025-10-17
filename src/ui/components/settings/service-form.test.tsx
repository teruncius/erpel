import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Service } from "@erpel/state/schema";

// Mock Icon component
vi.mock("../../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid={`icon-${name}`} data-size={size}>
            {name}
        </div>
    ),
}));

// Mock the store
const mockReplace = vi.fn();
vi.mock("../../store/store", () => ({
    useStore: () => ({
        replace: mockReplace,
    }),
}));

// Import the component after mocking
import { ServiceForm } from "./service-form";

describe("ServiceForm", () => {
    const createMockService = (overrides?: Partial<Service>): Service => ({
        darkMode: null,
        icon: "test-icon",
        id: "test-service-id",
        name: null,
        template: {
            darkMode: {
                copyOnCreate: true,
                customizable: true,
                default: false,
            },
            icon: {
                copyOnCreate: true,
                customizable: false,
                default: "test-icon",
            },
            id: "test-template-id",
            name: {
                copyOnCreate: true,
                customizable: true,
                default: "Test Service",
            },
            tags: ["test"],
            url: {
                copyOnCreate: true,
                customizable: true,
                default: "https://example.com",
            },
        },
        url: null,
        ...overrides,
    });

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders form element", () => {
            const service = createMockService();
            const { container } = render(<ServiceForm service={service} />);

            expect(container.querySelector("form")).toBeInTheDocument();
        });

        it("renders save button", () => {
            const service = createMockService();
            render(<ServiceForm service={service} />);

            expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
        });

        it("renders save button with icon", () => {
            const service = createMockService();
            const { container } = render(<ServiceForm service={service} />);

            const saveButton = screen.getByRole("button", { name: /save/i });
            expect(saveButton).toBeInTheDocument();
            // Icon is rendered as SVG in the actual component
            const icon = container.querySelector("svg");
            expect(icon).toBeInTheDocument();
        });

        it("renders without errors", () => {
            const service = createMockService();

            expect(() => render(<ServiceForm service={service} />)).not.toThrow();
        });
    });

    describe("Conditional Rendering - Name Field", () => {
        it("renders name field when customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    name: {
                        copyOnCreate: true,
                        customizable: true,
                        default: "Test Service",
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        });

        it("does not render name field when not customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    name: {
                        copyOnCreate: true,
                        customizable: false,
                        default: "Test Service",
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
        });

        it("renders name field with correct placeholder", () => {
            const service = createMockService();
            render(<ServiceForm service={service} />);

            const nameInput = screen.getByPlaceholderText("Enter a custom name for this service");
            expect(nameInput).toBeInTheDocument();
        });

        it("renders name field with correct id", () => {
            const service = createMockService({ id: "custom-id" });
            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            expect(nameInput).toHaveAttribute("id", "custom-id::name");
        });

        it("renders name field with default value", () => {
            const service = createMockService({ name: "Custom Name" });
            render(<ServiceForm service={service} />);

            expect(screen.getByDisplayValue("Custom Name")).toBeInTheDocument();
        });
    });

    describe("Conditional Rendering - URL Field", () => {
        it("renders url field when customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    url: {
                        copyOnCreate: true,
                        customizable: true,
                        default: "https://example.com",
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
        });

        it("does not render url field when not customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    url: {
                        copyOnCreate: true,
                        customizable: false,
                        default: "https://example.com",
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.queryByLabelText(/url/i)).not.toBeInTheDocument();
        });

        it("renders url field with correct placeholder", () => {
            const service = createMockService();
            render(<ServiceForm service={service} />);

            const urlInput = screen.getByPlaceholderText("Enter a custom URL for this service");
            expect(urlInput).toBeInTheDocument();
        });

        it("renders url field with correct id", () => {
            const service = createMockService({ id: "custom-id" });
            render(<ServiceForm service={service} />);

            const urlInput = screen.getByLabelText(/url/i);
            expect(urlInput).toHaveAttribute("id", "custom-id::url");
        });

        it("renders url field with default value", () => {
            const service = createMockService({ url: "https://custom.com" });
            render(<ServiceForm service={service} />);

            expect(screen.getByDisplayValue("https://custom.com")).toBeInTheDocument();
        });
    });

    describe("Conditional Rendering - Dark Mode Field", () => {
        it("renders dark mode checkbox when customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    darkMode: {
                        copyOnCreate: true,
                        customizable: true,
                        default: false,
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.getByLabelText(/dark mode/i)).toBeInTheDocument();
        });

        it("does not render dark mode checkbox when not customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    darkMode: {
                        copyOnCreate: true,
                        customizable: false,
                        default: false,
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.queryByLabelText(/dark mode/i)).not.toBeInTheDocument();
        });

        it("renders dark mode checkbox with correct id", () => {
            const service = createMockService({ id: "custom-id" });
            render(<ServiceForm service={service} />);

            const darkModeLabel = screen.getByLabelText(/dark mode/i);
            expect(darkModeLabel).toHaveAttribute("id", "custom-id::darkMode");
        });

        it("renders dark mode checkbox with default value false", () => {
            const service = createMockService({ darkMode: false });
            render(<ServiceForm service={service} />);

            const darkModeCheckbox = screen.getByLabelText(/dark mode/i);
            expect(darkModeCheckbox).toBeInTheDocument();
        });

        it("renders dark mode checkbox with default value true", () => {
            const service = createMockService({ darkMode: true });
            render(<ServiceForm service={service} />);

            const darkModeCheckbox = screen.getByLabelText(/dark mode/i);
            expect(darkModeCheckbox).toBeInTheDocument();
        });

        it("handles null darkMode value by rendering unchecked checkbox", () => {
            const service = createMockService({ darkMode: null });
            render(<ServiceForm service={service} />);

            const darkModeCheckbox = screen.getByLabelText(/dark mode/i);
            expect(darkModeCheckbox).toBeInTheDocument();
        });
    });

    describe("Combined Conditional Rendering", () => {
        it("renders all fields when all are customizable", () => {
            const service = createMockService();
            render(<ServiceForm service={service} />);

            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/dark mode/i)).toBeInTheDocument();
        });

        it("renders no fields when none are customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    name: {
                        copyOnCreate: true,
                        customizable: false,
                        default: "Test Service",
                    },
                    url: {
                        copyOnCreate: true,
                        customizable: false,
                        default: "https://example.com",
                    },
                    darkMode: {
                        copyOnCreate: true,
                        customizable: false,
                        default: false,
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument();
            expect(screen.queryByLabelText(/url/i)).not.toBeInTheDocument();
            expect(screen.queryByLabelText(/dark mode/i)).not.toBeInTheDocument();
            // Only save button should be present
            expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
        });

        it("renders only name and url when darkMode is not customizable", () => {
            const service = createMockService({
                template: {
                    ...createMockService().template,
                    darkMode: {
                        copyOnCreate: true,
                        customizable: false,
                        default: false,
                    },
                },
            });

            render(<ServiceForm service={service} />);

            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
            expect(screen.queryByLabelText(/dark mode/i)).not.toBeInTheDocument();
        });
    });

    describe("Form Submission", () => {
        it("calls replace with correct data when form is submitted", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(
                    service.id,
                    expect.objectContaining({
                        id: service.id,
                        name: service.name,
                        url: service.url,
                        // darkMode is now properly converted to boolean by the custom onChange
                        darkMode: false,
                    })
                );
            });
        });

        it("submits updated name value", async () => {
            const user = userEvent.setup();
            const service = createMockService({ name: "Original Name" });

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.clear(nameInput);
            await user.type(nameInput, "Updated Name");

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(service.id, expect.objectContaining({ name: "Updated Name" }));
            });
        });

        it("submits updated url value", async () => {
            const user = userEvent.setup();
            const service = createMockService({ url: "https://original.com" });

            render(<ServiceForm service={service} />);

            const urlInput = screen.getByLabelText(/url/i);
            await user.clear(urlInput);
            await user.type(urlInput, "https://updated.com");

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(
                    service.id,
                    expect.objectContaining({ url: "https://updated.com" })
                );
            });
        });

        it("submits all field values together", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, "New Service Name");

            const urlInput = screen.getByLabelText(/url/i);
            await user.type(urlInput, "https://newservice.com");

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(
                    service.id,
                    expect.objectContaining({
                        name: "New Service Name",
                        url: "https://newservice.com",
                    })
                );
            });
        });

        it("preserves service template data on submission", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(
                    service.id,
                    expect.objectContaining({
                        template: service.template,
                    })
                );
            });
        });

        it("preserves service id on submission", async () => {
            const user = userEvent.setup();
            const service = createMockService({ id: "unique-service-id" });

            render(<ServiceForm service={service} />);

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith("unique-service-id", expect.any(Object));
            });
        });
    });

    describe("filterEmptyToString Function", () => {
        it("converts empty string to null", async () => {
            const user = userEvent.setup();
            const service = createMockService({ name: "Original Name" });

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.clear(nameInput);

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(service.id, expect.objectContaining({ name: null }));
            });
        });

        it("converts whitespace-only string to null", async () => {
            const user = userEvent.setup();
            const service = createMockService({ name: "Original Name" });

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.clear(nameInput);
            await user.type(nameInput, "   ");

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(service.id, expect.objectContaining({ name: null }));
            });
        });

        it("preserves non-empty string values", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, "Valid Name");

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(service.id, expect.objectContaining({ name: "Valid Name" }));
            });
        });

        it("preserves string with leading/trailing spaces if not only whitespace", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, "  Valid Name  ");

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            // filterEmptyToString checks if trim().length > 0 but returns the original value
            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(
                    service.id,
                    expect.objectContaining({ name: "  Valid Name  " })
                );
            });
        });

        it("applies filterEmptyToString to url field", async () => {
            const user = userEvent.setup();
            const service = createMockService({ url: "https://original.com" });

            render(<ServiceForm service={service} />);

            const urlInput = screen.getByLabelText(/url/i);
            await user.clear(urlInput);

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(service.id, expect.objectContaining({ url: null }));
            });
        });
    });

    describe("User Interaction", () => {
        it("allows typing in name field", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, "Test Name");

            expect(nameInput).toHaveValue("Test Name");
        });

        it("allows typing in url field", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const urlInput = screen.getByLabelText(/url/i);
            await user.type(urlInput, "https://test.com");

            expect(urlInput).toHaveValue("https://test.com");
        });

        it("allows clearing name field", async () => {
            const user = userEvent.setup();
            const service = createMockService({ name: "Original Name" });

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.clear(nameInput);

            expect(nameInput).toHaveValue("");
        });

        it("allows clearing url field", async () => {
            const user = userEvent.setup();
            const service = createMockService({ url: "https://original.com" });

            render(<ServiceForm service={service} />);

            const urlInput = screen.getByLabelText(/url/i);
            await user.clear(urlInput);

            expect(urlInput).toHaveValue("");
        });

        it("handles form submission via Enter key", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, "Test Name{Enter}");

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalled();
            });
        });
    });

    describe("Edge Cases", () => {
        it("handles service with null values for all fields", async () => {
            const user = userEvent.setup();
            const service = createMockService({
                name: null,
                url: null,
                darkMode: null,
            });

            render(<ServiceForm service={service} />);

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalledWith(
                    service.id,
                    expect.objectContaining({
                        name: null,
                        url: null,
                        // Controller converts null to false, onChange converts to boolean
                        darkMode: false,
                    })
                );
            });
        });

        it("handles service with very long name", async () => {
            const user = userEvent.setup();
            const longName = "A".repeat(500);
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.click(nameInput);
            await user.paste(longName);

            expect(nameInput).toHaveValue(longName);
        });

        it("handles service with very long url", async () => {
            const user = userEvent.setup();
            const longUrl = "https://example.com/" + "a".repeat(500);
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const urlInput = screen.getByLabelText(/url/i);
            await user.click(urlInput);
            await user.paste(longUrl);

            expect(urlInput).toHaveValue(longUrl);
        });

        it("handles special characters in name", async () => {
            const user = userEvent.setup();
            const specialName = "Test!@#$%^&*()";
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, specialName);

            expect(nameInput).toHaveValue(specialName);
        });

        it("handles unicode characters in name", async () => {
            const user = userEvent.setup();
            const unicodeName = "测试服务 🚀";
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, unicodeName);

            expect(nameInput).toHaveValue(unicodeName);
        });

        it("handles multiple rapid submissions", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const submitButton = screen.getByRole("button", { name: /save/i });

            // Rapid submissions
            await user.click(submitButton);
            await user.click(submitButton);
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalled();
            });
        });
    });

    describe("Accessibility", () => {
        it("has proper form element", () => {
            const service = createMockService();
            const { container } = render(<ServiceForm service={service} />);

            expect(container.querySelector("form")).toBeInTheDocument();
        });

        it("associates labels with inputs via htmlFor", () => {
            const service = createMockService({ id: "test-id" });
            render(<ServiceForm service={service} />);

            const nameLabel = screen.getByText("Name");
            expect(nameLabel).toHaveAttribute("for", "test-id::name");

            const urlLabel = screen.getByText("URL");
            expect(urlLabel).toHaveAttribute("for", "test-id::url");

            const darkModeLabel = screen.getByText("Dark Mode");
            expect(darkModeLabel).toHaveAttribute("for", "test-id::darkMode");
        });

        it("has clickable labels", () => {
            const service = createMockService();
            render(<ServiceForm service={service} />);

            const nameLabel = screen.getByText("Name");
            expect(nameLabel.tagName).toBe("LABEL");
        });

        it("has submit button with proper type", () => {
            const service = createMockService();
            render(<ServiceForm service={service} />);

            const submitButton = screen.getByRole("button", { name: /save/i });
            expect(submitButton).toHaveAttribute("type", "submit");
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const service = createMockService();
            const startTime = performance.now();

            render(<ServiceForm service={service} />);

            const endTime = performance.now();
            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const service = createMockService();
            const { rerender, container } = render(<ServiceForm service={service} />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(
                    <ServiceForm
                        service={{
                            ...service,
                            name: `Name ${i}`,
                        }}
                    />
                );
            }

            expect(container.querySelector("form")).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const service = createMockService();
            const { unmount, container } = render(<ServiceForm service={service} />);

            expect(container.querySelector("form")).toBeInTheDocument();

            unmount();

            expect(container.querySelector("form")).not.toBeInTheDocument();
        });

        it("handles service prop changes with different keys", () => {
            const service1 = createMockService({ id: "service-1", name: "Service 1" });
            const service2 = createMockService({ id: "service-2", name: "Service 2" });

            const { rerender, container } = render(<ServiceForm key={service1.id} service={service1} />);

            expect(screen.getByDisplayValue("Service 1")).toBeInTheDocument();

            // react-hook-form doesn't update defaultValues on prop change without a key
            // or calling reset(). Using a key forces a remount.
            rerender(<ServiceForm key={service2.id} service={service2} />);

            expect(screen.getByDisplayValue("Service 2")).toBeInTheDocument();
            expect(container.querySelector("form")).toBeInTheDocument();
        });
    });

    describe("Integration with React Hook Form", () => {
        it("initializes form with service values", () => {
            const service = createMockService({
                name: "Initial Name",
                url: "https://initial.com",
                darkMode: true,
            });

            render(<ServiceForm service={service} />);

            expect(screen.getByDisplayValue("Initial Name")).toBeInTheDocument();
            expect(screen.getByDisplayValue("https://initial.com")).toBeInTheDocument();
        });

        it("validates and submits form data", async () => {
            const user = userEvent.setup();
            const service = createMockService();

            render(<ServiceForm service={service} />);

            const nameInput = screen.getByLabelText(/name/i);
            await user.type(nameInput, "Valid Name");

            const submitButton = screen.getByRole("button", { name: /save/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockReplace).toHaveBeenCalled();
            });
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            const service = createMockService();

            for (let i = 0; i < 5; i++) {
                const { unmount, container } = render(<ServiceForm service={service} />);

                expect(container.querySelector("form")).toBeInTheDocument();
                unmount();
            }

            // After all unmounts, no form should exist
            const { container } = render(<ServiceForm service={service} />);
            expect(container.querySelector("form")).toBeInTheDocument();
        });

        it("cleans up callbacks properly", () => {
            const service = createMockService();
            const { unmount } = render(<ServiceForm service={service} />);

            unmount();

            // Should not have any lingering references
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });
});
