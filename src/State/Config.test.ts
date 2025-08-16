import { expect, afterEach, beforeEach, test, vi, describe } from 'vitest';
import { fs, vol } from 'memfs';
import { DefaultConfig, loadConfig, saveConfig } from './Config';
import { DEFAULT_SIDE_BAR_IS_OPEN } from './Settings';

describe('Config', () => {
    beforeEach(() => {
        vi.mock('node:fs/promises');
        vi.stubGlobal('console', { log: vi.fn(), warn: vi.fn(), error: vi.fn() });
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
