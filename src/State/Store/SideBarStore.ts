import { StateCreator } from 'zustand/vanilla';
import { DEFAULT_SIDE_BAR_IS_OPEN } from '../Settings';

export interface SideBarStoreState {
    isOpen: boolean
}

export interface SideBarStoreActions {
    toggle: () => void
}

const initialValues: SideBarStoreState = {
    isOpen: DEFAULT_SIDE_BAR_IS_OPEN,
};

export const createSideBarSlice: StateCreator<SideBarStoreState & SideBarStoreActions> = (set) => ({
    ...initialValues,
    toggle: () => {
        set((state) => ({ isOpen: !state.isOpen }));
    },
});
