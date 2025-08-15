import { contextBridge, ipcRenderer } from 'electron';
import { AppMessage } from '../AppMessage';
import { Config, Service } from '../State/Schema';

interface ElectronAPI {
    loadConfig: () => Promise<Config>
    saveConfig: (data: Config) => void

    addService: (service: Service) => void
    removeService: (id: string) => void
    activateService: (id: string) => void
    hideAllServices: () => void

    focusWindow: () => void
    setSidebarState: (isOpen: boolean) => void
}

// use as:
// declare const window: ElectronWindow;
export interface ElectronWindow extends Window {
    electron: ElectronAPI
}

const api: ElectronAPI = {
    loadConfig: () => ipcRenderer.invoke(AppMessage.LoadConfig),
    saveConfig: (data) => ipcRenderer.send(AppMessage.SaveConfig, data),

    addService: (service) => ipcRenderer.send(AppMessage.AddService, service),
    removeService: (id) => ipcRenderer.send(AppMessage.RemoveService, id),
    activateService: (id) => ipcRenderer.send(AppMessage.ActivateService, id),
    hideAllServices: () => ipcRenderer.send(AppMessage.HideAllServices),

    focusWindow: () => ipcRenderer.send(AppMessage.FocusWindow),
    setSidebarState: (isOpen) => ipcRenderer.send(AppMessage.SetSideBarState, isOpen),
};

contextBridge.exposeInMainWorld('electron', api);
