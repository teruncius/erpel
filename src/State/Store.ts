import { create } from 'zustand';
import { createServiceSlice, ServiceStoreActions, ServiceStoreState } from './ServiceStore';
import { persist, PersistStorage } from 'zustand/middleware';
import { ElectronWindow } from '../PreloadFeatures/AppBridge';
import { createSideBarSlice, SideBarStoreActions, SideBarStoreState } from './SideBarStore';

declare const window: ElectronWindow;

type State = ServiceStoreState & SideBarStoreState;
type Actions = ServiceStoreActions & SideBarStoreActions;

const storage: PersistStorage<Partial<State>> = {
    getItem: async () => {
        console.log('persist::getItem');
        const data = await window.electron.loadData();

        // TODO: load all user settings
        return {
            version: data.version,
            state: {
                currentServices: data.services,
            },
        };
    },
    setItem: (name, value) => {
        console.log('persist::setItem');
        // TODO: store all user settings
        window.electron.saveData({
            version: value.version,
            services: value.state.currentServices,
        });
    },
    removeItem: () => {
        console.log('persist::removeItem');
    },
};

export const useStore = create<State & Actions>()(
    persist(
        (...args) => ({
            ...createServiceSlice(...args),
            ...createSideBarSlice(...args),
        }),
        {
            name: 'storage',
            storage: storage,
        },
    ),
);
