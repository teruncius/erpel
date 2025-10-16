import { enable } from 'darkreader';
import { contextBridge, ipcRenderer } from 'electron';

import { AppMessage } from '../app-message';

interface DarkReaderAPI {
    run: () => void
}

const api: DarkReaderAPI = {
    run: async () => {
        const status = await ipcRenderer.invoke(AppMessage.ShouldUseDarkMode);
        if (status) {
            enable({});
        }
    },
};

interface DarkReaderWindow extends Window {
    DarkReader: DarkReaderAPI
}

declare const window: DarkReaderWindow;

contextBridge.exposeInMainWorld('DarkReader', api);
contextBridge.executeInMainWorld({
    func: () => {
        document.addEventListener('DOMContentLoaded', () => {
            window.DarkReader.run();
        });
    },
});
