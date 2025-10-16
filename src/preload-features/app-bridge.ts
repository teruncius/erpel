import { contextBridge, ipcRenderer } from 'electron';

import { AppMessage } from '../app-message';
import { Config, Service } from '../state/schema';

// use as:
// declare const window: ElectronWindow;
export interface ElectronWindow extends Window {
    electron: ElectronAPI;
}

interface ElectronAPI {
    activateService: (id: string) => void;
    addService: (service: Service) => void;

    focusWindow: () => void;
    hideAllServices: () => void;
    loadConfig: () => Promise<Config>;
    removeService: (id: string) => void;

    saveConfig: (data: Config) => void;
    setSidebarState: (isOpen: boolean) => void;
}

const api: ElectronAPI = {
    activateService: (id) => ipcRenderer.send(AppMessage.ActivateService, id),
    addService: (service) => ipcRenderer.send(AppMessage.AddService, service),

    focusWindow: () => ipcRenderer.send(AppMessage.FocusWindow),
    hideAllServices: () => ipcRenderer.send(AppMessage.HideAllServices),
    loadConfig: () => ipcRenderer.invoke(AppMessage.LoadConfig),
    removeService: (id) => ipcRenderer.send(AppMessage.RemoveService, id),

    saveConfig: (data) => ipcRenderer.send(AppMessage.SaveConfig, data),
    setSidebarState: (isOpen) => ipcRenderer.send(AppMessage.SetSideBarState, isOpen),
};

contextBridge.exposeInMainWorld('electron', api);
