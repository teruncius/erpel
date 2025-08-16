import { z } from 'zod';
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { Config, ConfigSchema } from '../Schema';
import { DEFAULT_SERVICE_TEMPLATES } from '../Settings';
import { createServiceSlice, ServiceStoreActions, ServiceStoreState } from './ServiceStore';
import { createSettingsSlice, SettingsStoreActions, SettingsStoreState } from './SettingsStore';
import { createSideBarSlice, SideBarStoreActions, SideBarStoreState } from './SideBarStore';

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
