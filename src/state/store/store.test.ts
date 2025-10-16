import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { useStore } from './store';

describe('Store', () => {
    const loadConfig = vi.fn();
    const saveConfig = vi.fn();

    beforeEach(() => {
        // Mock the window.electron object by directly setting the property
        (globalThis.window as any).electron = {
            loadConfig,
            saveConfig,
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('loads state from electron api', () => {
        // rehydrates triggers load
        useStore.persist.rehydrate();
        expect(loadConfig).toBeCalledTimes(1);
    });

    test('saves state to electron api', () => {
        // setState triggers save
        useStore.setState(useStore.getInitialState());
        expect(saveConfig).toBeCalledTimes(1);
    });
});
