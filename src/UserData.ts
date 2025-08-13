import { app } from 'electron';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { DEFAULT_I18N, DEFAULT_IS_MUTED, DEFAULT_SERVICES, i18nSettings, Service } from './State/Settings';

const LATEST_VERSION = 0;

export interface UserData {
    version: number
    services: Service[]
    i18n: i18nSettings
    isMuted: boolean
}

const INITIAL_DATA: UserData = {
    version: LATEST_VERSION,
    services: DEFAULT_SERVICES,
    i18n: DEFAULT_I18N,
    isMuted: DEFAULT_IS_MUTED,
};

const CONFIG_PATH = join(app.getPath('userData'), 'config.json');

export async function loadUserData(): Promise<UserData> {
    try {
        const value = await readFile(CONFIG_PATH, { encoding: 'utf8' });
        return JSON.parse(value);
    } catch (e) {
        console.warn('User data not found', e.message);
        return INITIAL_DATA;
    }
}

export async function saveUserData(data: UserData) {
    try {
        const value = JSON.stringify(data, null, 4);
        await writeFile(CONFIG_PATH, value, { encoding: 'utf8' });
    } catch (e) {
        console.error('User data not found', e.message);
    }
}
