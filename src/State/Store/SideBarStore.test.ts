import { describe, beforeEach, expect, test } from 'vitest';
import { create } from 'zustand/index';
import { createSideBarSlice, SideBarStoreActions, SideBarStoreState } from './SideBarStore';

export const useStore = create<SideBarStoreState & SideBarStoreActions>()(
    (...args) => ({
        ...createSideBarSlice(...args),
    }),
);

describe('SideBarStore', () => {
    beforeEach(() => {
        useStore.setState(useStore.getInitialState());
    });

    test('side bar is initially open', () => {
        expect(useStore.getState().isOpen).toEqual(true);
    });

    test('side bar is toggled', () => {
        useStore.getState().toggle();
        expect(useStore.getState().isOpen).toEqual(false);

        useStore.getState().toggle();
        expect(useStore.getState().isOpen).toEqual(true);
    });
});
