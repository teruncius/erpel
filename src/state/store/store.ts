import { z } from 'zod';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

import { ElectronWindow } from '../../preload-features/app-bridge';
import { Config, ConfigSchema } from '../schema';
import { DEFAULT_SERVICE_TEMPLATES } from '../settings';
import { createServiceSlice, ServiceStoreActions, ServiceStoreState } from './service-store';
import { createSettingsSlice, SettingsStoreActions, SettingsStoreState } from './settings-store';
import { createSideBarSlice, SideBarStoreActions, SideBarStoreState } from './side-bar-store';

declare const window: ElectronWindow;

export type StoreState = ServiceStoreState & SettingsStoreState & SideBarStoreState;
type StoreActions = ServiceStoreActions & SettingsStoreActions & SideBarStoreActions;

const storage: PersistStorage<StoreState> = {
    getItem: async () => {
        const config = await window.electron.loadConfig();
        const state = TransformConfigToStoreState(config);
        return { state, version: 0 };
    },
    removeItem: () => {
        console.warn('Unable to remove items with persist');
    },
    setItem: (name, value) => {
        const config = TransformStoreStateToConfig(value.state);
        window.electron.saveConfig(config);
    },
};

export const useStore = create<StoreActions & StoreState>()(
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

function TransformConfigToStoreState(config: Config): StoreState {
    const { version: _, ...rest } = config;
    return {
        ...rest,
        // templates are not stored in user data
        templates: DEFAULT_SERVICE_TEMPLATES,
    };
}

function TransformStoreStateToConfig(data: StoreState) {
    const result = z.safeParse(ConfigSchema, { version: 0, ...data });
    if (result.success) {
        return result.data;
    }
    console.error(result.error);
    throw Error('Failed to convert store state to config');
}
