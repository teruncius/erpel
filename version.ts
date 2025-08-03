import fs from 'node:fs/promises';
import path from 'node:path';

export const run = async () => {
    const name = path.join(__dirname, './package.json');
    const json = await fs.readFile(name);
    const data = JSON.parse(json.toString());
    data.version = process.env.FORGE_APP_VERSION || 'unknown';
    await fs.writeFile(name, JSON.stringify(data, null, 4));
};
