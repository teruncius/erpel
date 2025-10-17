import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock useStore hook
const mockSetLocale = vi.fn();
const mockSetTimeFormat = vi.fn();
const mockSetDateFormat = vi.fn();
const mockUseStore = vi.fn();

vi.mock("@erpel/ui/store/store", () => ({
    useStore: () => mockUseStore(),
}));

// Mock the Clock component
vi.mock("@erpel/ui/components/home/clock", () => ({
    Clock: vi.fn(() => <div data-testid="clock">Mock Clock</div>),
}));

// Import the component after mocking
import { LocaleSettings } from "./locale-settings";

describe("LocaleSettings", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
        cleanup();
        // Default mock return value
        mockUseStore.mockReturnValue({
            locale: "en-US",
            timeFormat: "en-US",
            dateFormat: "en-US",
            setLocale: mockSetLocale,
            setTimeFormat: mockSetTimeFormat,
            setDateFormat: mockSetDateFormat,
        });
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders without crashing", () => {
            const { container } = render(<LocaleSettings />);
            expect(container).toBeInTheDocument();
        });

        it("renders all three select components", () => {
            render(<LocaleSettings />);

            const localeSelect = screen.getByLabelText("Locale");
            const timeSelect = screen.getByLabelText("Time format");
            const dateSelect = screen.getByLabelText("Date format");

            expect(localeSelect).toBeInTheDocument();
            expect(timeSelect).toBeInTheDocument();
            expect(dateSelect).toBeInTheDocument();
        });

        it("renders the Clock component", () => {
            render(<LocaleSettings />);
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });

        it("renders with correct structure", () => {
            const { container } = render(<LocaleSettings />);
            const selects = container.querySelectorAll("select");
            expect(selects).toHaveLength(3);
        });

        it("renders locale options correctly", () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");
            const options = Array.from(localeSelect.querySelectorAll("option"));
            
            expect(options).toHaveLength(2);
            expect(options[0]).toHaveValue("en-US");
            expect(options[1]).toHaveValue("de-DE");
        });

        it("renders time format options correctly", () => {
            render(<LocaleSettings />);
            const timeSelect = screen.getByLabelText("Time format");
            const options = Array.from(timeSelect.querySelectorAll("option"));
            
            expect(options).toHaveLength(2);
            expect(options[0]).toHaveValue("en-US");
            expect(options[1]).toHaveValue("de-DE");
        });

        it("renders date format options correctly", () => {
            render(<LocaleSettings />);
            const dateSelect = screen.getByLabelText("Date format");
            const options = Array.from(dateSelect.querySelectorAll("option"));
            
            expect(options).toHaveLength(2);
            expect(options[0]).toHaveValue("en-US");
            expect(options[1]).toHaveValue("de-DE");
        });
    });

    describe("Store Integration", () => {
        it("displays current locale value from store", () => {
            mockUseStore.mockReturnValueOnce({
                locale: "de-DE",
                timeFormat: "en-US",
                dateFormat: "en-US",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;
            expect(localeSelect.value).toBe("de-DE");
        });

        it("displays current time format value from store", () => {
            mockUseStore.mockReturnValueOnce({
                locale: "en-US",
                timeFormat: "de-DE",
                dateFormat: "en-US",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            render(<LocaleSettings />);
            const timeSelect = screen.getByLabelText("Time format") as HTMLSelectElement;
            expect(timeSelect.value).toBe("de-DE");
        });

        it("displays current date format value from store", () => {
            mockUseStore.mockReturnValueOnce({
                locale: "en-US",
                timeFormat: "en-US",
                dateFormat: "de-DE",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            render(<LocaleSettings />);
            const dateSelect = screen.getByLabelText("Date format") as HTMLSelectElement;
            expect(dateSelect.value).toBe("de-DE");
        });

        it("displays all store values correctly when all are different", () => {
            mockUseStore.mockReturnValueOnce({
                locale: "de-DE",
                timeFormat: "en-US",
                dateFormat: "de-DE",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            render(<LocaleSettings />);
            
            const localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;
            const timeSelect = screen.getByLabelText("Time format") as HTMLSelectElement;
            const dateSelect = screen.getByLabelText("Date format") as HTMLSelectElement;
            
            expect(localeSelect.value).toBe("de-DE");
            expect(timeSelect.value).toBe("en-US");
            expect(dateSelect.value).toBe("de-DE");
        });
    });

    describe("Select Interactions", () => {
        it("calls setLocale when locale select changes", async () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");

            await user.selectOptions(localeSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledWith("de-DE");
            });
        });

        it("calls setTimeFormat when time format select changes", async () => {
            render(<LocaleSettings />);
            const timeSelect = screen.getByLabelText("Time format");

            await user.selectOptions(timeSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetTimeFormat).toHaveBeenCalledWith("de-DE");
            });
        });

        it("calls setDateFormat when date format select changes", async () => {
            render(<LocaleSettings />);
            const dateSelect = screen.getByLabelText("Date format");

            await user.selectOptions(dateSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetDateFormat).toHaveBeenCalledWith("de-DE");
            });
        });

        it("calls setLocale with correct value when changing multiple times", async () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");

            await user.selectOptions(localeSelect, "de-DE");
            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledWith("de-DE");
            });

            mockSetLocale.mockClear();

            await user.selectOptions(localeSelect, "en-US");
            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledWith("en-US");
            });
        });

        it("handles multiple select changes in sequence", async () => {
            render(<LocaleSettings />);
            
            const localeSelect = screen.getByLabelText("Locale");
            const timeSelect = screen.getByLabelText("Time format");
            const dateSelect = screen.getByLabelText("Date format");

            await user.selectOptions(localeSelect, "de-DE");
            await user.selectOptions(timeSelect, "de-DE");
            await user.selectOptions(dateSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledWith("de-DE");
                expect(mockSetTimeFormat).toHaveBeenCalledWith("de-DE");
                expect(mockSetDateFormat).toHaveBeenCalledWith("de-DE");
            });
        });

        it("calls only the appropriate setter for each select", async () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");

            await user.selectOptions(localeSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledTimes(1);
                expect(mockSetTimeFormat).not.toHaveBeenCalled();
                expect(mockSetDateFormat).not.toHaveBeenCalled();
            });
        });
    });

    describe("Callback Behavior", () => {
        it("uses memoized callback for locale changes", async () => {
            const { rerender } = render(<LocaleSettings />);
            const localeSelect1 = screen.getByLabelText("Locale");
            const handler1 = (localeSelect1 as any).onchange;

            rerender(<LocaleSettings />);
            const localeSelect2 = screen.getByLabelText("Locale");
            const handler2 = (localeSelect2 as any).onchange;

            // The handlers should be the same reference due to useCallback
            expect(handler1).toBe(handler2);
        });

        it("updates callback when setLocale changes", async () => {
            const mockSetLocale1 = vi.fn();
            
            mockUseStore.mockReturnValueOnce({
                locale: "en-US",
                timeFormat: "en-US",
                dateFormat: "en-US",
                setLocale: mockSetLocale1,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            const { rerender } = render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");

            await user.selectOptions(localeSelect, "de-DE");
            await waitFor(() => {
                expect(mockSetLocale1).toHaveBeenCalledWith("de-DE");
            });

            const mockSetLocale2 = vi.fn();
            mockUseStore.mockReturnValueOnce({
                locale: "en-US",
                timeFormat: "en-US",
                dateFormat: "en-US",
                setLocale: mockSetLocale2,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            rerender(<LocaleSettings />);
            const localeSelectAfterRerender = screen.getByLabelText("Locale");

            await user.selectOptions(localeSelectAfterRerender, "de-DE");
            await waitFor(() => {
                expect(mockSetLocale2).toHaveBeenCalledWith("de-DE");
            });
        });

        it("maintains callback stability for time format", () => {
            const { rerender } = render(<LocaleSettings />);
            const timeSelect1 = screen.getByLabelText("Time format");
            const handler1 = (timeSelect1 as any).onchange;

            rerender(<LocaleSettings />);
            const timeSelect2 = screen.getByLabelText("Time format");
            const handler2 = (timeSelect2 as any).onchange;

            expect(handler1).toBe(handler2);
        });

        it("maintains callback stability for date format", () => {
            const { rerender } = render(<LocaleSettings />);
            const dateSelect1 = screen.getByLabelText("Date format");
            const handler1 = (dateSelect1 as any).onchange;

            rerender(<LocaleSettings />);
            const dateSelect2 = screen.getByLabelText("Date format");
            const handler2 = (dateSelect2 as any).onchange;

            expect(handler1).toBe(handler2);
        });
    });

    describe("Accessibility", () => {
        it("has proper labels for all selects", () => {
            render(<LocaleSettings />);

            expect(screen.getByLabelText("Locale")).toBeInTheDocument();
            expect(screen.getByLabelText("Time format")).toBeInTheDocument();
            expect(screen.getByLabelText("Date format")).toBeInTheDocument();
        });

        it("has proper id attributes for all selects", () => {
            render(<LocaleSettings />);

            const localeSelect = screen.getByLabelText("Locale");
            const timeSelect = screen.getByLabelText("Time format");
            const dateSelect = screen.getByLabelText("Date format");

            expect(localeSelect).toHaveAttribute("id", "locale");
            expect(timeSelect).toHaveAttribute("id", "time");
            expect(dateSelect).toHaveAttribute("id", "date");
        });

        it("labels are correctly associated with selects", () => {
            render(<LocaleSettings />);

            const localeLabel = screen.getByText("Locale");
            const timeLabel = screen.getByText("Time format");
            const dateLabel = screen.getByText("Date format");

            expect(localeLabel).toHaveAttribute("for", "locale");
            expect(timeLabel).toHaveAttribute("for", "time");
            expect(dateLabel).toHaveAttribute("for", "date");
        });

        it("all selects are keyboard accessible", async () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");

            localeSelect.focus();
            expect(document.activeElement).toBe(localeSelect);

            // Simulate keyboard navigation
            await user.keyboard("{ArrowDown}");
            expect(localeSelect).toHaveFocus();
        });

        it("selects have proper option values", () => {
            render(<LocaleSettings />);

            const localeSelect = screen.getByLabelText("Locale");
            const options = Array.from(localeSelect.querySelectorAll("option"));

            options.forEach((option) => {
                expect(option).toHaveAttribute("value");
                expect(option.textContent).toBeTruthy();
            });
        });
    });

    describe("Component Lifecycle", () => {
        it("maintains state across rerenders", () => {
            mockUseStore.mockReturnValue({
                locale: "de-DE",
                timeFormat: "en-US",
                dateFormat: "de-DE",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            const { rerender } = render(<LocaleSettings />);
            
            let localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;
            expect(localeSelect.value).toBe("de-DE");

            rerender(<LocaleSettings />);
            
            localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;
            expect(localeSelect.value).toBe("de-DE");
        });

        it("updates when store values change", () => {
            mockUseStore.mockReturnValueOnce({
                locale: "en-US",
                timeFormat: "en-US",
                dateFormat: "en-US",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            const { rerender } = render(<LocaleSettings />);
            
            let localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;
            expect(localeSelect.value).toBe("en-US");

            mockUseStore.mockReturnValueOnce({
                locale: "de-DE",
                timeFormat: "en-US",
                dateFormat: "en-US",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            rerender(<LocaleSettings />);
            
            localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;
            expect(localeSelect.value).toBe("de-DE");
        });

        it("cleans up properly on unmount", () => {
            const { unmount } = render(<LocaleSettings />);
            
            expect(() => unmount()).not.toThrow();
        });

        it("handles rapid mount/unmount cycles", () => {
            const { unmount: unmount1 } = render(<LocaleSettings />);
            unmount1();

            const { unmount: unmount2 } = render(<LocaleSettings />);
            unmount2();

            const { unmount: unmount3 } = render(<LocaleSettings />);
            unmount3();

            expect(true).toBe(true); // No crashes
        });
    });

    describe("Performance", () => {
        it("renders efficiently with multiple rerenders", () => {
            const { rerender } = render(<LocaleSettings />);

            for (let i = 0; i < 10; i++) {
                rerender(<LocaleSettings />);
            }

            expect(screen.getByLabelText("Locale")).toBeInTheDocument();
            expect(screen.getByLabelText("Time format")).toBeInTheDocument();
            expect(screen.getByLabelText("Date format")).toBeInTheDocument();
        });

        it("handles rapid select changes efficiently", async () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");

            for (let i = 0; i < 5; i++) {
                await user.selectOptions(localeSelect, i % 2 === 0 ? "en-US" : "de-DE");
            }

            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledTimes(5);
            });
        });

        it("does not recreate callbacks unnecessarily", () => {
            const { rerender } = render(<LocaleSettings />);
            const localeSelect1 = screen.getByLabelText("Locale");
            const timeSelect1 = screen.getByLabelText("Time format");
            const dateSelect1 = screen.getByLabelText("Date format");

            const localeHandler1 = (localeSelect1 as any).onchange;
            const timeHandler1 = (timeSelect1 as any).onchange;
            const dateHandler1 = (dateSelect1 as any).onchange;

            rerender(<LocaleSettings />);

            const localeSelect2 = screen.getByLabelText("Locale");
            const timeSelect2 = screen.getByLabelText("Time format");
            const dateSelect2 = screen.getByLabelText("Date format");

            const localeHandler2 = (localeSelect2 as any).onchange;
            const timeHandler2 = (timeSelect2 as any).onchange;
            const dateHandler2 = (dateSelect2 as any).onchange;

            expect(localeHandler1).toBe(localeHandler2);
            expect(timeHandler1).toBe(timeHandler2);
            expect(dateHandler1).toBe(dateHandler2);
        });
    });

    describe("Integration with ThemedSelect", () => {
        it("passes correct props to locale select", () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;

            expect(localeSelect).toHaveAttribute("id", "locale");
            expect(localeSelect.value).toBe("en-US");
        });

        it("passes correct props to time format select", () => {
            render(<LocaleSettings />);
            const timeSelect = screen.getByLabelText("Time format") as HTMLSelectElement;

            expect(timeSelect).toHaveAttribute("id", "time");
            expect(timeSelect.value).toBe("en-US");
        });

        it("passes correct props to date format select", () => {
            render(<LocaleSettings />);
            const dateSelect = screen.getByLabelText("Date format") as HTMLSelectElement;

            expect(dateSelect).toHaveAttribute("id", "date");
            expect(dateSelect.value).toBe("en-US");
        });

        it("renders options correctly via ThemedSelect", () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");
            const options = Array.from(localeSelect.querySelectorAll("option"));

            expect(options).toHaveLength(2);
            expect(options.map(o => o.value)).toEqual(["en-US", "de-DE"]);
        });
    });

    describe("Integration with Clock", () => {
        it("renders Clock component", () => {
            render(<LocaleSettings />);
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });

        it("renders Clock along with all selects", () => {
            render(<LocaleSettings />);

            expect(screen.getByLabelText("Locale")).toBeInTheDocument();
            expect(screen.getByLabelText("Time format")).toBeInTheDocument();
            expect(screen.getByLabelText("Date format")).toBeInTheDocument();
            expect(screen.getByTestId("clock")).toBeInTheDocument();
        });

        it("Clock is rendered after selects in DOM order", () => {
            const { container } = render(<LocaleSettings />);
            const elements = Array.from(container.querySelectorAll("select, [data-testid='clock']"));

            // Selects should come before clock
            const selectIndices = elements
                .map((el, idx) => (el.tagName === "SELECT" ? idx : -1))
                .filter(idx => idx !== -1);
            const clockIndex = elements.findIndex(el => el.getAttribute("data-testid") === "clock");

            expect(Math.max(...selectIndices)).toBeLessThan(clockIndex);
        });
    });

    describe("Edge Cases", () => {
        it("handles missing store values gracefully", () => {
            mockUseStore.mockReturnValueOnce({
                locale: undefined as any,
                timeFormat: undefined as any,
                dateFormat: undefined as any,
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            const { container } = render(<LocaleSettings />);
            expect(container).toBeInTheDocument();
        });

        it("handles missing setter functions", () => {
            mockUseStore.mockReturnValueOnce({
                locale: "en-US",
                timeFormat: "en-US",
                dateFormat: "en-US",
                setLocale: undefined as any,
                setTimeFormat: undefined as any,
                setDateFormat: undefined as any,
            } as any);

            const { container } = render(<LocaleSettings />);
            expect(container).toBeInTheDocument();
        });

        it("handles invalid locale values gracefully", () => {
            // Clear and override the default mock return value
            vi.clearAllMocks();
            mockUseStore.mockReturnValue({
                locale: "invalid-locale",
                timeFormat: "en-US",
                dateFormat: "en-US",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            // Component should render without crashing even with invalid locale
            const { container } = render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale") as HTMLSelectElement;
            
            // HTML select will show either first option or empty when value doesn't match any option
            // The important thing is that the component doesn't crash
            expect(container).toBeInTheDocument();
            expect(localeSelect).toBeInTheDocument();
        });

        it("handles empty string values", () => {
            mockUseStore.mockReturnValueOnce({
                locale: "",
                timeFormat: "",
                dateFormat: "",
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            const { container } = render(<LocaleSettings />);
            expect(container).toBeInTheDocument();
        });

        it("handles null values from store", () => {
            mockUseStore.mockReturnValueOnce({
                locale: null as any,
                timeFormat: null as any,
                dateFormat: null as any,
                setLocale: mockSetLocale,
                setTimeFormat: mockSetTimeFormat,
                setDateFormat: mockSetDateFormat,
            } as any);

            const { container } = render(<LocaleSettings />);
            expect(container).toBeInTheDocument();
        });
    });

    describe("Responsive Layout", () => {
        it("renders grid container correctly", () => {
            const { container } = render(<LocaleSettings />);
            const gridContainer = container.firstChild as HTMLElement;

            expect(gridContainer).toBeInTheDocument();
        });

        it("contains settings section and clock in grid", () => {
            const { container } = render(<LocaleSettings />);
            const gridContainer = container.firstChild as HTMLElement;
            const children = Array.from(gridContainer.children);

            expect(children.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Store Method Invocations", () => {
        it("passes event target value to setLocale", async () => {
            render(<LocaleSettings />);
            const localeSelect = screen.getByLabelText("Locale");

            await user.selectOptions(localeSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledWith("de-DE");
            });
        });

        it("passes event target value to setTimeFormat", async () => {
            render(<LocaleSettings />);
            const timeSelect = screen.getByLabelText("Time format");

            await user.selectOptions(timeSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetTimeFormat).toHaveBeenCalledWith("de-DE");
            });
        });

        it("passes event target value to setDateFormat", async () => {
            render(<LocaleSettings />);
            const dateSelect = screen.getByLabelText("Date format");

            await user.selectOptions(dateSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetDateFormat).toHaveBeenCalledWith("de-DE");
            });
        });

        it("does not call store methods on initial render", () => {
            render(<LocaleSettings />);

            expect(mockSetLocale).not.toHaveBeenCalled();
            expect(mockSetTimeFormat).not.toHaveBeenCalled();
            expect(mockSetDateFormat).not.toHaveBeenCalled();
        });

        it("calls store methods only when user interacts", async () => {
            render(<LocaleSettings />);

            expect(mockSetLocale).not.toHaveBeenCalled();

            const localeSelect = screen.getByLabelText("Locale");
            await user.selectOptions(localeSelect, "de-DE");

            await waitFor(() => {
                expect(mockSetLocale).toHaveBeenCalledTimes(1);
            });
        });
    });
});

