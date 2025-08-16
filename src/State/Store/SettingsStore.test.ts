import { beforeEach, describe, expect, test } from 'vitest';
import { create } from 'zustand';

import { createSettingsSlice, SettingsStoreActions, SettingsStoreState } from './SettingsStore';

export const useStore = create<SettingsStoreActions & SettingsStoreState>()(
    (...args) => ({
        ...createSettingsSlice(...args),
    }),
);

describe('SettingsStore', () => {
    beforeEach(() => {
        useStore.setState(useStore.getInitialState());
    });

    test('locale is set to default', () => {
        expect(useStore.getState().locale).toEqual('en-US');
    });
});
