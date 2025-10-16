import { StateCreator } from "zustand/vanilla";

import { DEFAULT_SIDE_BAR_IS_OPEN } from "../../state/settings";

export interface SideBarStoreActions {
    toggle: () => void;
}

export interface SideBarStoreState {
    isOpen: boolean;
}

const initialValues: SideBarStoreState = {
    isOpen: DEFAULT_SIDE_BAR_IS_OPEN,
};

export const createSideBarSlice: StateCreator<SideBarStoreActions & SideBarStoreState> = (set) => ({
    ...initialValues,
    toggle: () => {
        set((state) => ({ isOpen: !state.isOpen }));
    },
});
