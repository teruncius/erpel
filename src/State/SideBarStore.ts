import { StateCreator } from 'zustand/vanilla';

export type SideBarStoreState = {
    isOpen: boolean
}

export type SideBarStoreActions = {
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
