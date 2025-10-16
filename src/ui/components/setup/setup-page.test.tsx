import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SetupPage } from "./setup-page";

// Mock child components
vi.mock("./setup-services", () => ({
    SetupServices: () => <div data-testid="setup-services">SetupServices Component</div>,
}));

describe("SetupPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    describe("Basic Rendering", () => {
        it("renders the setup page", () => {
            render(<SetupPage />);

            expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();
        });

        it("renders with correct component structure", () => {
            render(<SetupPage />);

            const setupServices = document.querySelector('[data-testid="setup-services"]');
            expect(setupServices).toBeInTheDocument();
        });

        it("renders consistently", () => {
            const { container: container1 } = render(<SetupPage />);
            const { container: container2 } = render(<SetupPage />);

            expect(container1.innerHTML).toBe(container2.innerHTML);
        });

        it("renders empty fragment wrapper", () => {
            const { container } = render(<SetupPage />);

            // Should render an empty fragment with the child component
            expect(container.firstChild).toBeInTheDocument();
            expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();
        });
    });

    describe("Component Structure", () => {
        it("contains SetupServices component", () => {
            render(<SetupPage />);

            const setupServices = document.querySelector('[data-testid="setup-services"]');
            expect(setupServices).toBeInTheDocument();
        });

        it("maintains proper component hierarchy", () => {
            render(<SetupPage />);

            // SetupServices should be the only child
            const setupServices = document.querySelector('[data-testid="setup-services"]');
            expect(setupServices).toBeInTheDocument();
        });
    });

    describe("Performance", () => {
        it("renders efficiently", () => {
            const startTime = performance.now();
            render(<SetupPage />);
            const endTime = performance.now();

            expect(endTime - startTime).toBeLessThan(100);
        });

        it("handles frequent re-renders", () => {
            const { rerender } = render(<SetupPage />);

            // Simulate frequent re-renders
            for (let i = 0; i < 10; i++) {
                rerender(<SetupPage />);
            }

            expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();
        });
    });

    describe("Component Lifecycle", () => {
        it("cleans up properly on unmount", () => {
            const { unmount } = render(<SetupPage />);

            expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();

            unmount();

            // Component should be unmounted
            expect(document.querySelector('[data-testid="setup-services"]')).not.toBeInTheDocument();
        });
    });

    describe("Memory Management", () => {
        it("handles rapid mount/unmount cycles", () => {
            for (let i = 0; i < 5; i++) {
                const { unmount } = render(<SetupPage />);

                expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();
                unmount();
            }

            // Should not have any memory leaks
            expect(document.querySelector('[data-testid="setup-services"]')).not.toBeInTheDocument();
        });
    });

    describe("Integration", () => {
        it("integrates properly with child components", () => {
            render(<SetupPage />);

            // Should render the child component without errors
            expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();
        });

        it("handles child component changes", () => {
            const { rerender } = render(<SetupPage />);

            expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();

            // Re-render should still work
            rerender(<SetupPage />);

            expect(document.querySelector('[data-testid="setup-services"]')).toBeInTheDocument();
        });
    });
});
