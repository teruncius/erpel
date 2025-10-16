import { arrayMove } from '@dnd-kit/sortable';
import { StateCreator } from 'zustand/vanilla';

import { ElectronWindow } from '../../PreloadFeatures/AppBridge';
import { Service, ServiceTemplate } from '../Schema';
import { ServiceFromTemplate } from '../Settings';

export interface ServiceStoreActions {
    add: (service: Service) => void
    addFromTemplate: (template: ServiceTemplate) => void
    clear: () => void
    loadServicesFromFile: (services: Service[]) => void
    loadServicesFromPreset: () => void
    remove: (id: string) => void
    reorder: (fromIndex: number, toIndex: number) => void
    replace: (id: string, service: Service) => void
}

export interface ServiceStoreState {
    services: Service[]
    templates: ServiceTemplate[]
}

const initialValues: ServiceStoreState = {
    services: [],
    templates: [],
};

declare const window: ElectronWindow;

export const createServiceSlice: StateCreator<ServiceStoreActions & ServiceStoreState> = (set, get) => ({
    ...initialValues,
    add: (service: Service) => {
        const services = [...get().services, service];
        set({ services });
        window.electron.addService(service);
    },
    addFromTemplate: (template: ServiceTemplate) => {
        get().add(ServiceFromTemplate(template));
    },
    clear: () => {
        get().services.map((service) => get().remove(service.id));
    },
    loadServicesFromFile: (services: Service[]) => {
        get().clear();
        services.map((service) => get().add(service));
    },
    loadServicesFromPreset: () => {
        get().clear();
        const ids = ['5106fdb4-04a3-4659-8d76-54a79fbf45a2', '2b027a28-172a-4180-bd5a-32070b046b77'];
        const templates = get().templates.filter((service) => ids.includes(service.id));
        templates.map((template) => get().addFromTemplate(template));
    },
    remove: (id: string) => {
        const services = get().services.filter((service) => service.id !== id);
        set({ services });
        window.electron.removeService(id);
    },
    reorder: (fromIndex: number, toIndex: number) => {
        const services = arrayMove(get().services, fromIndex, toIndex);
        set({ services });
    },
    replace: (id: string, service: Service) => {
        const services = [...get().services];
        const idx = services.findIndex((service) => service.id === id);

        if (idx === -1) {
            console.warn(`Unable to replace service ${id}, because it was not found. Adding the new service instead.`);
            get().add(service);
        }
        else {
            services[idx] = service;
            set({ services });
            window.electron.removeService(id);
            window.electron.addService(service);
        }
    },
});
