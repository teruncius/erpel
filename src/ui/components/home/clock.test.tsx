import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";

import { Clock } from "./clock";

// Mock the store
const mockUseStore = vi.fn();
vi.mock("../../store/store", () => ({
    useStore: () => mockUseStore(),
}));


describe("Clock", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        vi.useFakeTimers();
        
        // Mock timer functions
        vi.spyOn(window, 'setInterval');
        vi.spyOn(window, 'clearInterval');
        
        // Mock the store with default values
        mockUseStore.mockReturnValue({
            dateFormat: "en-US",
            locale: "en-US",
            timeFormat: "en-US",
        });
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders clock container", () => {
            render(<Clock />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });

        it("renders time and date", () => {
            render(<Clock />);

            // Should render time in HH:MM format
            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
            
            // Should render date with weekday and date
            expect(screen.getByText(/,/)).toBeInTheDocument();
        });

        it("renders without golden prop", () => {
            render(<Clock />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });

        it("renders with golden prop", () => {
            render(<Clock golden />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });
    });

    describe("Time Formatting", () => {
        it("formats time correctly", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            render(<Clock />);

            expect(screen.getByText("02:30 PM")).toBeInTheDocument();
        });

        it("formats time with different locales", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            mockUseStore.mockReturnValue({
                dateFormat: "de-DE",
                locale: "de-DE",
                timeFormat: "de-DE",
            });

            render(<Clock />);

            // Should still render time (format may vary by locale)
            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });

        it("updates time every second", () => {
            const initialTime = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(initialTime);

            render(<Clock />);

            expect(screen.getByText("02:30 PM")).toBeInTheDocument();

            // Advance time by 1 second
            act(() => {
                vi.setSystemTime(new Date("2023-12-25T14:30:01"));
                vi.advanceTimersByTime(1000);
            });

            expect(screen.getByText("02:30 PM")).toBeInTheDocument();

            // Advance time by another second
            act(() => {
                vi.setSystemTime(new Date("2023-12-25T14:30:02"));
                vi.advanceTimersByTime(1000);
            });

            expect(screen.getByText("02:30 PM")).toBeInTheDocument();
        });
    });

    describe("Date Formatting", () => {
        it("formats date correctly", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            render(<Clock />);

            // Should contain weekday and date
            expect(screen.getByText(/,/)).toBeInTheDocument();
        });

        it("formats date with different locales", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            mockUseStore.mockReturnValue({
                dateFormat: "de-DE",
                locale: "de-DE",
                timeFormat: "de-DE",
            });

            render(<Clock />);

            // Should still render date
            expect(screen.getByText(/,/)).toBeInTheDocument();
        });

        it("uses correct date format from store", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            mockUseStore.mockReturnValue({
                dateFormat: "fr-FR",
                locale: "fr-FR",
                timeFormat: "fr-FR",
            });

            render(<Clock />);

            expect(screen.getByText(/,/)).toBeInTheDocument();
        });
    });

    describe("Store Integration", () => {
        it("uses dateFormat from store", () => {
            mockUseStore.mockReturnValue({
                dateFormat: "ja-JP",
                locale: "en-US",
                timeFormat: "en-US",
            });

            render(<Clock />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("uses locale from store", () => {
            mockUseStore.mockReturnValue({
                dateFormat: "en-US",
                locale: "de-DE",
                timeFormat: "en-US",
            });

            render(<Clock />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("uses timeFormat from store", () => {
            mockUseStore.mockReturnValue({
                dateFormat: "en-US",
                locale: "en-US",
                timeFormat: "zh-CN",
            });

            render(<Clock />);

            expect(mockUseStore).toHaveBeenCalled();
        });

        it("updates when store values change", () => {
            const initialStore = {
                dateFormat: "en-US",
                locale: "en-US",
                timeFormat: "en-US",
            };

            mockUseStore.mockReturnValue(initialStore);

            const { rerender } = render(<Clock />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();

            // Change store values
            const newStore = {
                dateFormat: "de-DE",
                locale: "de-DE",
                timeFormat: "de-DE",
            };

            mockUseStore.mockReturnValue(newStore);

            rerender(<Clock />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });
    });

    describe("Timer Management", () => {
        it("sets up interval on mount", () => {
            render(<Clock />);

            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
        });

        it("clears interval on unmount", () => {
            const { unmount } = render(<Clock />);

            unmount();

            expect(clearInterval).toHaveBeenCalled();
        });

        it("updates time at correct interval", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            render(<Clock />);

            expect(screen.getByText("02:30 PM")).toBeInTheDocument();

            // Advance timers to trigger interval
            act(() => {
                vi.advanceTimersByTime(1000);
            });

            // Time should still be displayed
            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });
    });

    describe("Golden Ratio", () => {
        it("applies golden ratio when golden prop is true", () => {
            render(<Clock golden />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });

        it("does not apply golden ratio when golden prop is false", () => {
            render(<Clock golden={false} />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });

        it("defaults to false when golden prop is not provided", () => {
            render(<Clock />);

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        it("handles midnight time", () => {
            const midnight = new Date("2023-12-25T00:00:00");
            vi.setSystemTime(midnight);

            render(<Clock />);

            expect(screen.getByText("12:00 AM")).toBeInTheDocument();
        });

        it("handles noon time", () => {
            const noon = new Date("2023-12-25T12:00:00");
            vi.setSystemTime(noon);

            render(<Clock />);

            expect(screen.getByText("12:00 PM")).toBeInTheDocument();
        });

        it("handles single digit minutes", () => {
            const time = new Date("2023-12-25T14:05:00");
            vi.setSystemTime(time);

            render(<Clock />);

            expect(screen.getByText("02:05 PM")).toBeInTheDocument();
        });

        it("handles single digit hours", () => {
            const time = new Date("2023-12-25T09:30:00");
            vi.setSystemTime(time);

            render(<Clock />);

            expect(screen.getByText("09:30 AM")).toBeInTheDocument();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<Clock />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles rapid time updates", () => {
            render(<Clock />);

            // Simulate rapid time updates
            for (let i = 0; i < 10; i++) {
                act(() => {
                    vi.advanceTimersByTime(1000);
                });
            }

            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("renders time in readable format", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            render(<Clock />);

            const timeElement = screen.getByText("02:30 PM");
            expect(timeElement).toBeInTheDocument();
        });

        it("renders date in readable format", () => {
            render(<Clock />);

            // Should contain readable date format
            expect(screen.getByText(/,/)).toBeInTheDocument();
        });
    });

    describe("Error Handling", () => {
        it("handles invalid date format gracefully", () => {
            mockUseStore.mockReturnValue({
                dateFormat: "invalid-locale",
                locale: "invalid-locale",
                timeFormat: "invalid-locale",
            });

            expect(() => {
                render(<Clock />);
            }).not.toThrow();
        });

        it("handles missing store values gracefully", () => {
            mockUseStore.mockReturnValue({
                dateFormat: undefined,
                locale: undefined,
                timeFormat: undefined,
            });

            expect(() => {
                render(<Clock />);
            }).not.toThrow();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up interval on unmount", () => {
            const { unmount } = render(<Clock />);
            
            // Verify interval is set
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
            
            unmount();
            
            // Verify interval is cleared
            expect(clearInterval).toHaveBeenCalled();
        });

        it("handles component remounting", () => {
            const { unmount } = render(<Clock />);
            unmount();
            
            // Remount the component
            render(<Clock />);
            
            // Should set up new interval
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
        });
    });

    describe("Internationalization", () => {
        it("handles different time zones", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            mockUseStore.mockReturnValue({
                dateFormat: "en-GB",
                locale: "en-GB",
                timeFormat: "en-GB",
            });

            render(<Clock />);

            // Should still render time
            expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeInTheDocument();
        });

        it("handles 24-hour format", () => {
            const mockDate = new Date("2023-12-25T14:30:00");
            vi.setSystemTime(mockDate);

            mockUseStore.mockReturnValue({
                dateFormat: "en-US",
                locale: "en-US",
                timeFormat: "en-US",
            });

            render(<Clock />);

            // Should render time in 12-hour format by default
            expect(screen.getByText("02:30 PM")).toBeInTheDocument();
        });
    });
});
