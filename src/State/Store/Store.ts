import { create } from 'zustand';
import { createServiceSlice, ServiceStoreActions, ServiceStoreState } from './ServiceStore';
import { persist, PersistStorage } from 'zustand/middleware';
import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { createSideBarSlice, SideBarStoreActions, SideBarStoreState } from './SideBarStore';
import { createSettingsSlice, SettingsStoreActions, SettingsStoreState } from './SettingsStore';
import { z } from 'zod';
import { Config, ConfigSchema } from '../Schema';
import { DEFAULT_SERVICE_TEMPLATES } from '../Settings';

declare const window: ElectronWindow;

export type StoreState = ServiceStoreState & SideBarStoreState & SettingsStoreState;
type StoreActions = ServiceStoreActions & SideBarStoreActions & SettingsStoreActions;

const storage: PersistStorage<StoreState> = {
    getItem: async () => {
        const config = await window.electron.loadConfig();
        const state = TransformConfigToStoreState(config);
        return { version: 0, state };
    },
    setItem: (name, value) => {
        const config = TransformStoreStateToConfig(value.state);
        window.electron.saveConfig(config);
    },
    removeItem: () => {
        console.warn('Unable to remove items with persist');
    },
};

export const useStore = create<StoreState & StoreActions>()(
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

function TransformStoreStateToConfig(data: StoreState) {
    const result = z.safeParse(ConfigSchema, { version: 0, ...data });
    if (result.success) {
        return result.data;
    }
    console.error(result.error);
    throw Error('Failed to convert store state to config');
}

function TransformConfigToStoreState(config: Config): StoreState {
    const { version: _, ...rest } = config;
    return {
        ...rest,
        // templates are not stored in user data
        templates: DEFAULT_SERVICE_TEMPLATES,
    };
}
