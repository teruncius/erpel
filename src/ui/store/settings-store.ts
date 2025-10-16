import { StateCreator } from 'zustand/vanilla';

import { BackgroundMode, DEFAULT_IS_MUTED, DEFAULT_LOCALE } from '../../state/settings';

export interface SettingsStoreActions {
    loadSettingsFromFile: (settings: SettingsStoreState) => void
    setDateFormat: (locale: string) => void
    setIsMuted: (isMuted: boolean) => void
    setLocale: (locale: string) => void
    setMode: (mode: BackgroundMode) => void
    setTimeFormat: (locale: string) => void
    setWallpapers: (wallpapers: string[]) => void
}

export interface SettingsStoreState {
    dateFormat: string
    isMuted: boolean
    locale: string
    mode: BackgroundMode
    timeFormat: string
    wallpapers: string[]
}

const initialValues: SettingsStoreState = {
    dateFormat: DEFAULT_LOCALE,
    isMuted: DEFAULT_IS_MUTED,
    locale: DEFAULT_LOCALE,
    mode: BackgroundMode.Wallpaper,
    timeFormat: DEFAULT_LOCALE,
    wallpapers: [],
};

export const createSettingsSlice: StateCreator<SettingsStoreActions & SettingsStoreState> = (set) => ({
    ...initialValues,
    loadSettingsFromFile: (settings: SettingsStoreState) => {
        set({ ...settings });
    },
    setDateFormat: (dateFormat: string) => {
        set({ dateFormat });
    },
    setIsMuted: (isMuted: boolean) => {
        set({ isMuted });
    },
    setLocale: (locale: string) => {
        set({ locale });
    },
    setMode: (mode: BackgroundMode) => {
        set({ mode });
    },
    setTimeFormat: (timeFormat: string) => {
        set({ timeFormat });
    },
    setWallpapers: (wallpapers: string[]) => {
        // TODO: validate for empty or invalid wallpapers
        set({ wallpapers });
    },
});
