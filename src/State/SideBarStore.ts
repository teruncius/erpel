import { StateCreator } from 'zustand/vanilla';

export interface SideBarStoreState {
    isOpen: boolean
}

export interface SideBarStoreActions {
    toggle: () => void
}

const initialValues: SideBarStoreState = {
    isOpen: true,
};

export const createSideBarSlice: StateCreator<SideBarStoreState & SideBarStoreActions> = (set) => ({
    ...initialValues,
    toggle: () => {
        set((state) => ({ isOpen: !state.isOpen }));
    },
});
