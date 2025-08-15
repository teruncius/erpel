import * as z from 'zod';
import { app } from 'electron';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { Config, ConfigSchema } from './Schema';
import {
    DEFAULT_IS_MUTED,
    DEFAULT_LOCALE,
    DEFAULT_MODE,
    DEFAULT_SERVICES,
    DEFAULT_SIDE_BAR_IS_OPEN,
    DEFAULT_WALLPAPERS,
} from './Settings';

const CONFIG_PATH = join(app.getPath('userData'), 'config.json');

export const DefaultConfig: Config = {
    version: 0,
    services: DEFAULT_SERVICES,
    isOpen: DEFAULT_SIDE_BAR_IS_OPEN,
    locale: DEFAULT_LOCALE,
    dateFormat: DEFAULT_LOCALE,
    timeFormat: DEFAULT_LOCALE,
    isMuted: DEFAULT_IS_MUTED,
    mode: DEFAULT_MODE,
    wallpapers: DEFAULT_WALLPAPERS,
};

export async function loadConfig(): Promise<Config> {
    try {
        const value = await readFile(CONFIG_PATH, { encoding: 'utf8' });
        const parsed = parseConfig(value);
        if (!parsed.success) {
            console.error('Unable to parse config:', parsed.error);
            return DefaultConfig;
        }
        return parsed.data;
    } catch (e) {
        console.warn('User data not found', e);
        return DefaultConfig;
    }
}

export async function saveConfig(data: Config) {
    try {
        const value = JSON.stringify(data, null, 4);
        await writeFile(CONFIG_PATH, value, { encoding: 'utf8' });
    } catch (e) {
        console.error('Unable to save user data', e);
    }
}

type Result<T> = {
    success: true
    data: T
} | {
    success: false
    error: string
}

function parseConfig(data: string): Result<Config> {
    const parsed = JSON.parse(data);
    if (isNaN(parsed.version)) {
        return { success: false, error: 'Unable to read config version' };
    }

    const result = z.safeParse(ConfigSchema, parsed);

    if (!result.success) {
        console.error('Zod parse error', result.error);
        return { success: false, error: 'Zod parse error' };
    }

    return { success: true, data: result.data };
}

