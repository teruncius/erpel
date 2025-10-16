import { beforeEach, describe, expect, it } from "vitest";
import { create } from "zustand";

import { DEFAULT_SIDE_BAR_IS_OPEN } from "../../state/settings";
import { createSideBarSlice, SideBarStoreActions, SideBarStoreState } from "./side-bar-store";

// Create a test store
const useTestStore = create<SideBarStoreActions & SideBarStoreState>()((...args) => ({
    ...createSideBarSlice(...args),
}));

describe("SideBarStore", () => {
    beforeEach(() => {
        useTestStore.setState({ isOpen: DEFAULT_SIDE_BAR_IS_OPEN });
    });

    describe("Initial State", () => {
        it("side bar is initially open", () => {
            expect(useTestStore.getState().isOpen).toEqual(DEFAULT_SIDE_BAR_IS_OPEN);
        });

        it("has correct default value", () => {
            expect(useTestStore.getState().isOpen).toEqual(true);
        });
    });

    describe("Toggle Functionality", () => {
        it("toggles from open to closed", () => {
            expect(useTestStore.getState().isOpen).toBe(true);

            useTestStore.getState().toggle();

            expect(useTestStore.getState().isOpen).toBe(false);
        });

        it("toggles from closed to open", () => {
            useTestStore.getState().toggle(); // Close first
            expect(useTestStore.getState().isOpen).toBe(false);

            useTestStore.getState().toggle(); // Open again

            expect(useTestStore.getState().isOpen).toBe(true);
        });

        it("toggles multiple times", () => {
            expect(useTestStore.getState().isOpen).toBe(true);

            useTestStore.getState().toggle(); // false
            expect(useTestStore.getState().isOpen).toBe(false);

            useTestStore.getState().toggle(); // true
            expect(useTestStore.getState().isOpen).toBe(true);

            useTestStore.getState().toggle(); // false
            expect(useTestStore.getState().isOpen).toBe(false);

            useTestStore.getState().toggle(); // true
            expect(useTestStore.getState().isOpen).toBe(true);
        });

        it("maintains toggle state consistency", () => {
            const initialState = useTestStore.getState().isOpen;

            useTestStore.getState().toggle();
            const afterFirstToggle = useTestStore.getState().isOpen;

            useTestStore.getState().toggle();
            const afterSecondToggle = useTestStore.getState().isOpen;

            expect(afterFirstToggle).toBe(!initialState);
            expect(afterSecondToggle).toBe(initialState);
        });
    });

    describe("State Management", () => {
        it("preserves state across multiple operations", () => {
            useTestStore.getState().toggle();
            const firstToggle = useTestStore.getState().isOpen;

            useTestStore.getState().toggle();
            const secondToggle = useTestStore.getState().isOpen;

            expect(firstToggle).toBe(false);
            expect(secondToggle).toBe(true);
        });

        it("handles rapid toggles", () => {
            const initialState = useTestStore.getState().isOpen;

            // Perform multiple rapid toggles
            for (let i = 0; i < 10; i++) {
                useTestStore.getState().toggle();
            }

            const finalState = useTestStore.getState().isOpen;
            expect(finalState).toBe(initialState); // Even number of toggles should return to initial state
        });

        it("handles rapid toggles with odd count", () => {
            const initialState = useTestStore.getState().isOpen;

            // Perform odd number of rapid toggles
            for (let i = 0; i < 7; i++) {
                useTestStore.getState().toggle();
            }

            const finalState = useTestStore.getState().isOpen;
            expect(finalState).toBe(!initialState); // Odd number of toggles should be opposite of initial state
        });
    });

    describe("Direct State Manipulation", () => {
        it("allows direct state setting", () => {
            useTestStore.setState({ isOpen: false });
            expect(useTestStore.getState().isOpen).toBe(false);

            useTestStore.setState({ isOpen: true });
            expect(useTestStore.getState().isOpen).toBe(true);
        });

        it("maintains toggle functionality after direct state setting", () => {
            useTestStore.setState({ isOpen: false });
            expect(useTestStore.getState().isOpen).toBe(false);

            useTestStore.getState().toggle();
            expect(useTestStore.getState().isOpen).toBe(true);
        });
    });

    describe("Edge Cases", () => {
        it("handles toggle when state is explicitly set to false", () => {
            useTestStore.setState({ isOpen: false });
            expect(useTestStore.getState().isOpen).toBe(false);

            useTestStore.getState().toggle();
            expect(useTestStore.getState().isOpen).toBe(true);
        });

        it("handles toggle when state is explicitly set to true", () => {
            useTestStore.setState({ isOpen: true });
            expect(useTestStore.getState().isOpen).toBe(true);

            useTestStore.getState().toggle();
            expect(useTestStore.getState().isOpen).toBe(false);
        });

        it("maintains state after reset to initial state", () => {
            useTestStore.getState().toggle();
            expect(useTestStore.getState().isOpen).toBe(false);

            useTestStore.setState({ isOpen: DEFAULT_SIDE_BAR_IS_OPEN });
            expect(useTestStore.getState().isOpen).toBe(true);
        });
    });

    describe("Function Reference Stability", () => {
        it("maintains stable toggle function reference", () => {
            const toggle1 = useTestStore.getState().toggle;
            const toggle2 = useTestStore.getState().toggle;

            expect(toggle1).toBe(toggle2);
        });

        it("toggle function works consistently", () => {
            const toggle = useTestStore.getState().toggle;
            const initialState = useTestStore.getState().isOpen;

            toggle();
            expect(useTestStore.getState().isOpen).toBe(!initialState);

            toggle();
            expect(useTestStore.getState().isOpen).toBe(initialState);
        });
    });

    describe("Integration with Store State", () => {
        it("has correct store structure", () => {
            const state = useTestStore.getState();

            expect(state).toHaveProperty("isOpen");
            expect(state).toHaveProperty("toggle");
            expect(typeof state.isOpen).toBe("boolean");
            expect(typeof state.toggle).toBe("function");
        });

        it("maintains state immutability", () => {
            const initialState = useTestStore.getState();
            const initialIsOpen = initialState.isOpen;

            useTestStore.getState().toggle();

            // Original state should not be mutated
            expect(initialState.isOpen).toBe(initialIsOpen);
            expect(useTestStore.getState().isOpen).toBe(!initialIsOpen);
        });
    });

    describe("Performance", () => {
        it("handles many toggle operations efficiently", () => {
            const startTime = performance.now();

            for (let i = 0; i < 1000; i++) {
                useTestStore.getState().toggle();
            }

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Should complete quickly (less than 100ms for 1000 operations)
            expect(duration).toBeLessThan(100);
        });

        it("maintains correct state after many operations", () => {
            const initialIsOpen = useTestStore.getState().isOpen;

            // Perform 1000 toggles
            for (let i = 0; i < 1000; i++) {
                useTestStore.getState().toggle();
            }

            // Should be back to initial state (even number of toggles)
            expect(useTestStore.getState().isOpen).toBe(initialIsOpen);
        });
    });
});
