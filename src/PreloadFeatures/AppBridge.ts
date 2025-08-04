import { contextBridge, ipcRenderer } from 'electron';
import { AppMessage } from '../AppMessage';
import { UserData } from '../UserData';
import { Service } from '../State/Settings';

interface ElectronAPI {
    saveData: (data: UserData) => void;
    loadData: () => Promise<UserData>;

    addService: (service: Service) => void;
    removeService: (id: string) => void;
    activateService: (id: string) => void;
    hideAllServices: () => void;

    focusWindow: () => void;
    setSidebarState: (isOpen: boolean) => void;
}

// use as:
// declare const window: ElectronWindow;
export interface ElectronWindow extends Window {
    electron: ElectronAPI;
}

const api: ElectronAPI = {
    saveData: (data) => ipcRenderer.send(AppMessage.SaveUserData, data),
    loadData: () => ipcRenderer.invoke(AppMessage.LoadUserData),

    addService: (service) => ipcRenderer.send(AppMessage.AddService, service),
    removeService: (id) => ipcRenderer.send(AppMessage.RemoveService, id),
    activateService: (id) => ipcRenderer.send(AppMessage.ActivateService, id),
    hideAllServices: () => ipcRenderer.send(AppMessage.HideAllServices),

    focusWindow: () => ipcRenderer.send(AppMessage.FocusWindow),
    setSidebarState: (isOpen) => ipcRenderer.send(AppMessage.SetSideBarState, isOpen),
};

contextBridge.exposeInMainWorld('electron', api);
