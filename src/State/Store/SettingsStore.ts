import { StateCreator } from 'zustand/vanilla';
import { BackgroundMode, DEFAULT_I18N, DEFAULT_IS_MUTED, i18nSettings, Locale } from '../Settings';

export interface SettingsStoreState {
    i18n: i18nSettings
    isMuted: boolean
    mode: BackgroundMode
    wallpapers: string[]
}

export interface SettingsStoreActions {
    setLocale: (locale: Locale) => void
    setTimeFormat: (locale: Locale) => void
    setDateFormat: (locale: Locale) => void
    setIsMuted: (isMuted: boolean) => void
    setMode: (mode: BackgroundMode) => void
    setWallpapers: (wallpapers: string[]) => void
}

const initialValues: SettingsStoreState = {
    i18n: DEFAULT_I18N,
    isMuted: DEFAULT_IS_MUTED,
    mode: BackgroundMode.Color,
    wallpapers: [],
};

export const createSettingsSlice: StateCreator<SettingsStoreState & SettingsStoreActions> = (set, get) => ({
    ...initialValues,
    setLocale: (locale: Locale) => {
        set({ i18n: { ...get().i18n, locale } });
    },
    setTimeFormat: (time: Locale) => {
        set({ i18n: { ...get().i18n, time } });
    },
    setDateFormat: (date: Locale) => {
        set({ i18n: { ...get().i18n, date } });
    },
    setIsMuted: (isMuted: boolean) => {
        set({ isMuted });
    },
    setMode: (mode: BackgroundMode) => {
        set({ mode });
    },
    setWallpapers: (wallpapers: string[]) => {
        set({ wallpapers });
    },
});
