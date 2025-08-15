import { StateCreator } from 'zustand/vanilla';
import { BackgroundMode, DEFAULT_LOCALE, DEFAULT_IS_MUTED } from '../Settings';

export interface SettingsStoreState {
    locale: string
    dateFormat: string
    timeFormat: string
    isMuted: boolean
    mode: BackgroundMode
    wallpapers: string[]
}

export interface SettingsStoreActions {
    loadSettingsFromFile: (settings: SettingsStoreState) => void
    setLocale: (locale: string) => void
    setTimeFormat: (locale: string) => void
    setDateFormat: (locale: string) => void
    setIsMuted: (isMuted: boolean) => void
    setMode: (mode: BackgroundMode) => void
    setWallpapers: (wallpapers: string[]) => void
}

const initialValues: SettingsStoreState = {
    locale: DEFAULT_LOCALE,
    dateFormat: DEFAULT_LOCALE,
    timeFormat: DEFAULT_LOCALE,
    isMuted: DEFAULT_IS_MUTED,
    mode: BackgroundMode.Wallpaper,
    wallpapers: [],
};

export const createSettingsSlice: StateCreator<SettingsStoreState & SettingsStoreActions> = (set) => ({
    ...initialValues,
    loadSettingsFromFile: (settings: SettingsStoreState) => {
        set({ ...settings });
    },
    setLocale: (locale: string) => {
        set({ locale });
    },
    setTimeFormat: (timeFormat: string) => {
        set({ timeFormat });
    },
    setDateFormat: (dateFormat: string) => {
        set({ dateFormat });
    },
    setIsMuted: (isMuted: boolean) => {
        set({ isMuted });
    },
    setMode: (mode: BackgroundMode) => {
        set({ mode });
    },
    setWallpapers: (wallpapers: string[]) => {
        // TODO: validate for empty or invalid wallpapers
        set({ wallpapers });
    },
});
