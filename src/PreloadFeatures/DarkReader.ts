import { contextBridge } from 'electron';
import { auto } from 'darkreader';

type DarkReaderAPI = {
    auto: () => void
}

interface DarkReaderWindow extends Window {
    DarkReader: DarkReaderAPI
}

const api: DarkReaderAPI = {
    auto: () => auto({}),
};

contextBridge.exposeInMainWorld('DarkReader', api);

declare const window: DarkReaderWindow;

contextBridge.executeInMainWorld({
    func: () => {
        document.addEventListener('DOMContentLoaded', () => {
            window.DarkReader.auto();
        });
    },
});
