import { app } from 'electron';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import type { Service } from './State/Settings';

const LATEST_VERSION = 0;

export interface UserData {
    version: number
    services: Service[]
}

const INITIAL_DATA: UserData = {
    version: LATEST_VERSION,
    services: [],
};

const CONFIG_PATH = join(app.getPath('userData'), 'config.json');

export async function loadUserData(): Promise<UserData> {
    try {
        const value = await readFile(CONFIG_PATH, { encoding: 'utf8' });
        return JSON.parse(value);
    } catch (e) {
        console.log('User data not found', e.message);
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
