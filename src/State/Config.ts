import { readFile, writeFile } from 'node:fs/promises';
import { z } from 'zod';

import { Config, ConfigSchema } from './Schema';
import {
    DEFAULT_IS_MUTED,
    DEFAULT_LOCALE,
    DEFAULT_MODE,
    DEFAULT_SERVICES,
    DEFAULT_SIDE_BAR_IS_OPEN,
    DEFAULT_WALLPAPERS,
} from './Settings';

export const DefaultConfig: Config = {
    dateFormat: DEFAULT_LOCALE,
    isMuted: DEFAULT_IS_MUTED,
    isOpen: DEFAULT_SIDE_BAR_IS_OPEN,
    locale: DEFAULT_LOCALE,
    mode: DEFAULT_MODE,
    services: DEFAULT_SERVICES,
    timeFormat: DEFAULT_LOCALE,
    version: 0,
    wallpapers: DEFAULT_WALLPAPERS,
};

type Result<T> = {
    data: T
    success: true
} | {
    error: string
    success: false
};

export async function loadConfig(path: string): Promise<Config> {
    try {
        const value = await readFile(path, { encoding: 'utf8' });
        const parsed = parseConfig(value);
        if (!parsed.success) {
            console.error('Unable to parse config:', parsed.error);
            return DefaultConfig;
        }
        return parsed.data;
    }
    catch (e) {
        console.warn('User data not found', e);
        return DefaultConfig;
    }
}

export async function saveConfig(path: string, data: Config) {
    try {
        const value = JSON.stringify(data, null, 4);
        await writeFile(path, value, { encoding: 'utf8' });
    }
    catch (e) {
        console.error('Unable to save user data', e);
    }
}

function parseConfig(data: string): Result<Config> {
    const parsed = JSON.parse(data);
    if (isNaN(parsed.version)) {
        return { error: 'Unable to read config version', success: false };
    }

    const result = z.safeParse(ConfigSchema, parsed);

    if (!result.success) {
        console.error('Zod parse error', result.error);
        return { error: 'Zod parse error', success: false };
    }

    return { data: result.data, success: true };
}
