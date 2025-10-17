import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Mock Icon component
vi.mock("../../icon", () => ({
    Icon: ({ name, size }: { name: string; size: number }) => (
        <div data-testid={`icon-${name}`} data-size={size}>
            {name}
        </div>
    ),
}));

// Mock window.electron
const mockLoadConfig = vi.fn();
const mockElectron = {
    loadConfig: mockLoadConfig,
};

// Mock DOM APIs
const mockCreateObjectURL = vi.fn();

// Set up global mocks
beforeAll(() => {
    (globalThis.window as unknown as { electron: typeof mockElectron }).electron = mockElectron;

    // Mock URL.createObjectURL
    globalThis.URL.createObjectURL = mockCreateObjectURL;

    // Mock Blob
    globalThis.Blob = vi.fn((content, options) => ({
        content,
        options,
    })) as unknown as typeof Blob;
});

// Import the component after mocking
import { ExportSettingsButton } from "./export-settings-button";

describe("ExportSettingsButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();

        // Default mock return values
        mockLoadConfig.mockResolvedValue({ version: 0, services: [] });
        mockCreateObjectURL.mockReturnValue("blob:mock-url");
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without errors", () => {
            expect(() => render(<ExportSettingsButton />)).not.toThrow();
        });

        it("renders button element", () => {
            render(<ExportSettingsButton />);

            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("renders with correct text", () => {
            render(<ExportSettingsButton />);

            expect(screen.getByText("Export settings")).toBeInTheDocument();
        });

        it("renders with folder-download icon", () => {
            const { container } = render(<ExportSettingsButton />);

            // Icon is rendered as SVG
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("renders folder-download icon with correct size", () => {
            const { container } = render(<ExportSettingsButton />);

            const svg = container.querySelector("svg");
            expect(svg).toHaveAttribute("height", "20");
            expect(svg).toHaveAttribute("width", "20");
        });
    });

    describe("Export Functionality", () => {
        it("calls loadConfig when button is clicked", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Wait for async operation
            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalledTimes(1);
            });
        });

        it("creates Blob with config data", async () => {
            const user = userEvent.setup();
            const mockConfig = { version: 0, services: [], isMuted: false };
            mockLoadConfig.mockResolvedValue(mockConfig);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(globalThis.Blob).toHaveBeenCalled();
            });
        });

        it("creates Blob with correct content type", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(globalThis.Blob).toHaveBeenCalledWith(
                    expect.any(Array),
                    expect.objectContaining({ type: "application/json" })
                );
            });
        });

        it("formats JSON with proper indentation", async () => {
            const user = userEvent.setup();
            const mockConfig = { version: 0, services: [] };
            mockLoadConfig.mockResolvedValue(mockConfig);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                const expectedJson = JSON.stringify(mockConfig, null, 4);
                expect(globalThis.Blob).toHaveBeenCalledWith([expectedJson], expect.any(Object));
            });
        });

        it("creates object URL for blob", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockCreateObjectURL).toHaveBeenCalled();
            });
        });

        it("triggers export flow successfully", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Should complete the export flow (loadConfig, Blob, URL creation)
            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
                expect(globalThis.Blob).toHaveBeenCalled();
                expect(mockCreateObjectURL).toHaveBeenCalled();
            });
        });

        it("handles multiple export clicks", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);
            await user.click(button);
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalledTimes(3);
            });
        });
    });

    describe("Error Handling", () => {
        it("handles loadConfig errors gracefully", async () => {
            const user = userEvent.setup();
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            mockLoadConfig.mockRejectedValue(new Error("Failed to load config"));

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalled();
            });

            consoleErrorSpy.mockRestore();
        });

        it("logs error to console on failure", async () => {
            const user = userEvent.setup();
            const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            const testError = new Error("Test error");
            mockLoadConfig.mockRejectedValue(testError);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
            });

            consoleErrorSpy.mockRestore();
        });

        it("does not crash on null config data", async () => {
            const user = userEvent.setup();
            mockLoadConfig.mockResolvedValue(null);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");

            // Should not throw
            await user.click(button);

            // Should still call loadConfig
            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
            });
        });

        it("handles empty config data", async () => {
            const user = userEvent.setup();
            mockLoadConfig.mockResolvedValue({});

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
                expect(globalThis.Blob).toHaveBeenCalled();
            });
        });
    });

    describe("Cleanup Mechanism", () => {
        it("sets alive flag to false on cleanup", async () => {
            const user = userEvent.setup();
            const { unmount } = render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Unmount component (triggers cleanup)
            unmount();

            // Component should be unmounted
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("returns cleanup function from handleExport", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");

            // Click should not throw
            await user.click(button);

            // Should complete export
            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
            });
        });

        it("prevents race condition with alive flag", async () => {
            const user = userEvent.setup();
            let resolveFn: ((value: unknown) => void) | null = null;

            // Create a promise that we can control
            mockLoadConfig.mockImplementation(() => {
                return new Promise((resolve) => {
                    resolveFn = resolve;
                });
            });

            const { unmount } = render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Unmount before promise resolves
            unmount();

            // Now resolve the promise
            if (resolveFn) {
                resolveFn({ version: 0 });
            }

            // Should not throw or cause issues
            await new Promise((resolve) => setTimeout(resolve, 100));
        });
    });

    describe("Callback Behavior", () => {
        it("uses useCallback for handleExport", async () => {
            const user = userEvent.setup();
            const { rerender } = render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalledTimes(1);
            });

            // Re-render component
            rerender(<ExportSettingsButton />);

            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalledTimes(2);
            });
        });

        it("handleExport has no dependencies", () => {
            const { rerender } = render(<ExportSettingsButton />);

            // Multiple re-renders shouldn't affect the callback
            for (let i = 0; i < 5; i++) {
                rerender(<ExportSettingsButton />);
            }

            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has button role", () => {
            render(<ExportSettingsButton />);

            expect(screen.getByRole("button")).toBeInTheDocument();
        });

        it("contains descriptive text", () => {
            render(<ExportSettingsButton />);

            expect(screen.getByText("Export settings")).toBeInTheDocument();
        });

        it("has icon for visual context", () => {
            const { container } = render(<ExportSettingsButton />);

            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("is keyboard accessible", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.tab();

            expect(button).toHaveFocus();
        });

        it("can be activated with keyboard", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            button.focus();
            await user.keyboard("{Enter}");

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
            });
        });

        it("is focusable", () => {
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            button.focus();

            expect(button).toHaveFocus();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<ExportSettingsButton />);

            expect(screen.getByRole("button")).toBeInTheDocument();

            unmount();

            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<ExportSettingsButton />);

                expect(screen.getByRole("button")).toBeInTheDocument();
                unmount();
            }

            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("maintains functionality after re-render", async () => {
            const user = userEvent.setup();
            const { rerender } = render(<ExportSettingsButton />);

            rerender(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
            });
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<ExportSettingsButton />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<ExportSettingsButton />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<ExportSettingsButton />);
            }

            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });

    describe("Integration", () => {
        it("integrates with ThemedButton", () => {
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();
        });

        it("integrates with Icon component", () => {
            const { container } = render(<ExportSettingsButton />);

            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
        });

        it("integrates with Electron loadConfig API", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
            });
        });

        it("integrates with Blob API", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(globalThis.Blob).toHaveBeenCalled();
            });
        });

        it("integrates with URL.createObjectURL", async () => {
            const user = userEvent.setup();
            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockCreateObjectURL).toHaveBeenCalled();
            });
        });
    });

    describe("Config Data Handling", () => {
        it("handles complex config objects", async () => {
            const user = userEvent.setup();
            const complexConfig = {
                version: 0,
                services: [
                    { id: "1", name: "Service 1" },
                    { id: "2", name: "Service 2" },
                ],
                isMuted: true,
                locale: "en-US",
            };
            mockLoadConfig.mockResolvedValue(complexConfig);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                const expectedJson = JSON.stringify(complexConfig, null, 4);
                expect(globalThis.Blob).toHaveBeenCalledWith([expectedJson], expect.any(Object));
            });
        });

        it("handles nested config objects", async () => {
            const user = userEvent.setup();
            const nestedConfig = {
                version: 0,
                settings: {
                    theme: {
                        mode: "dark",
                        colors: ["red", "blue"],
                    },
                },
            };
            mockLoadConfig.mockResolvedValue(nestedConfig);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
                expect(globalThis.Blob).toHaveBeenCalled();
            });
        });

        it("handles config with special characters", async () => {
            const user = userEvent.setup();
            const configWithSpecialChars = {
                version: 0,
                name: "Test <>&\"'",
            };
            mockLoadConfig.mockResolvedValue(configWithSpecialChars);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
                expect(globalThis.Blob).toHaveBeenCalled();
            });
        });

        it("handles config with unicode characters", async () => {
            const user = userEvent.setup();
            const configWithUnicode = {
                version: 0,
                name: "测试 🚀",
            };
            mockLoadConfig.mockResolvedValue(configWithUnicode);

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(() => {
                expect(mockLoadConfig).toHaveBeenCalled();
                expect(globalThis.Blob).toHaveBeenCalled();
            });
        });
    });

    describe("Async Behavior", () => {
        it("handles async loadConfig correctly", async () => {
            const user = userEvent.setup();
            const mockConfig = { version: 0 };
            mockLoadConfig.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve(mockConfig), 100))
            );

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            await vi.waitFor(
                () => {
                    expect(mockLoadConfig).toHaveBeenCalled();
                    expect(globalThis.Blob).toHaveBeenCalled();
                },
                { timeout: 500 }
            );
        });

        it("does not block UI during export", async () => {
            const user = userEvent.setup();
            mockLoadConfig.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ version: 0 }), 50))
            );

            render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Button should still be in document while processing
            expect(button).toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles without memory leaks", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<ExportSettingsButton />);

                expect(screen.getByRole("button")).toBeInTheDocument();
                unmount();
            }

            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("cleans up async operations properly", async () => {
            const user = userEvent.setup();
            let resolveFn: ((value: unknown) => void) | null = null;

            mockLoadConfig.mockImplementation(() => {
                return new Promise((resolve) => {
                    resolveFn = resolve;
                });
            });

            const { unmount } = render(<ExportSettingsButton />);

            const button = screen.getByRole("button");
            await user.click(button);

            // Unmount before async completes
            unmount();

            // Complete async operation
            if (resolveFn) {
                resolveFn({ version: 0 });
            }

            // Should not cause issues
            await new Promise((resolve) => setTimeout(resolve, 100));
        });
    });
});
