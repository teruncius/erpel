import { StateCreator } from 'zustand/vanilla';
import { DEFAULT_I18N, DEFAULT_IS_MUTED, i18nSettings, Locale } from '../Settings';

export interface SettingsStoreState {
    i18n: i18nSettings
    isMuted: boolean
}

export interface SettingsStoreActions {
    setLocale: (locale: Locale) => void
    setTimeFormat: (locale: Locale) => void
    setDateFormat: (locale: Locale) => void
    setIsMuted: (isMuted: boolean) => void
}

const initialValues: SettingsStoreState = {
    i18n: DEFAULT_I18N,
    isMuted: DEFAULT_IS_MUTED,
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
});
