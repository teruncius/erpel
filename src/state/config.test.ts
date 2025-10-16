import { fs, vol } from 'memfs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { DefaultConfig, loadConfig, saveConfig } from './config';
import { DEFAULT_SIDE_BAR_IS_OPEN } from './settings';

describe('Config', () => {
    beforeEach(() => {
        vi.mock('node:fs/promises');
        vi.stubGlobal('console', { error: vi.fn(), log: vi.fn(), warn: vi.fn() });
        vol.reset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const path = '/config.json';

    test('saves and loads the config to/from file', async () => {
        const config = { ...DefaultConfig, isOpen: !DEFAULT_SIDE_BAR_IS_OPEN };
        await saveConfig(path, config);

        const result = await loadConfig(path);
        expect(result).toEqual(DefaultConfig);
    });

    test('returns default config when file was not found', async () => {
        const result = await loadConfig(path);
        expect(result).toEqual(DefaultConfig);
    });

    test('returns default config when file could not be parsed', async () => {
        fs.writeFileSync(path, '{ invalid json');

        const result = await loadConfig(path);
        expect(result).toEqual(DefaultConfig);
    });
});
