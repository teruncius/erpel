import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import { Service } from './State/Settings';

const LATEST_VERSION = 0;

export type UserData = {
    version: number
    services: Service[]
};

const INITIAL_DATA: UserData = {
    version: LATEST_VERSION,
    services: [],
};

const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

export async function loadUserData(): Promise<UserData> {
    try {
        const value = await fs.readFile(CONFIG_PATH, { encoding: 'utf8' });
        const data = JSON.parse(value);
        console.log('User data loaded');
        return data;
    } catch (e) {
        console.log('User data not found');
        return INITIAL_DATA;
    }
}

export async function saveUserData(data: UserData) {
    try {
        const value = JSON.stringify(data, null, 4);
        await fs.writeFile(CONFIG_PATH, value, { encoding: 'utf8' });
        console.log('User data saved');
    } catch (e) {
        console.error('User data not found');
    }
}
