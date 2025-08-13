import { create } from 'zustand';
import { createServiceSlice, ServiceStoreActions, ServiceStoreState } from './ServiceStore';
import { persist, PersistStorage } from 'zustand/middleware';
import { ElectronWindow } from '../PreloadFeatures/AppBridge';
import { createSideBarSlice, SideBarStoreActions, SideBarStoreState } from './SideBarStore';
import { createSettingsSlice, SettingsStoreActions, SettingsStoreState } from './SettingsStore';
import { UserData } from '../UserData';

declare const window: ElectronWindow;

type State = ServiceStoreState & SideBarStoreState & SettingsStoreState;
type Actions = ServiceStoreActions & SideBarStoreActions & SettingsStoreActions;

const storage: PersistStorage<Partial<State>> = {
    getItem: async () => {
        console.log('persist::getItem');
        const data = await window.electron.loadData();

        const { version, ...rest } = data;
        return {
            version,
            state: { ...rest },
        };
    },
    setItem: (name, value) => {
        console.log('persist::setItem');
        // TODO: fix unsafe type assignment
        window.electron.saveData({
            version: value.version,
            services: value.state.services,
            i18n: value.state.i18n,
        } as UserData);
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
            ...createSettingsSlice(...args),
        }),
        {
            name: 'storage',
            storage: storage,
        },
    ),
);
