import { ServiceTemplate, Service, SERVICES, ServiceFromTemplate, DEFAULT_SERVICES } from '../Settings';
import { StateCreator } from 'zustand/vanilla';
import { ElectronWindow } from '../../PreloadFeatures/AppBridge';

export interface ServiceStoreState {
    services: Service[]
    templates: ServiceTemplate[]
}

export interface ServiceStoreActions {
    add: (service: Service) => void
    addFromTemplate: (template: ServiceTemplate) => void
    remove: (id: string) => void
    replace: (id: string, service: Service) => void
    clear: () => void
    swap: (id1: string, id2: string) => void
    usePreset: () => void
    useFile: (services: Service[]) => void
}

const initialValues: ServiceStoreState = {
    services: DEFAULT_SERVICES,
    templates: SERVICES,
};

declare const window: ElectronWindow;

export const createServiceSlice: StateCreator<ServiceStoreState & ServiceStoreActions> = (set, get) => ({
    ...initialValues,
    add: (service: Service) => {
        const services = [...get().services, service];
        set({ services });
        window.electron.addService(service);
    },
    addFromTemplate: (template: ServiceTemplate) => {
        get().add(ServiceFromTemplate(template));
    },
    remove: (id: string) => {
        const services = get().services.filter((service) => service.id !== id);
        set({ services });
        window.electron.removeService(id);
    },
    replace: (id: string, service: Service) => {
        const services = [...get().services];
        const idx = services.findIndex((service) => service.id === id);

        if (idx === -1) {
            console.warn(`Unable to replace service ${id}, because it was not found. Adding the new service instead.`);
            get().add(service);
        } else {
            services[idx] = service;
            set({ services });
            window.electron.removeService(id);
            window.electron.addService(service);
        }
    },
    clear: () => {
        get().services.map((service) => get().remove(service.id));
    },
    swap: (id1: string, id2: string) => {
        const services = [...get().services];
        const OLD = services.findIndex((service) => service.id === id1);
        const NEW = services.findIndex((service) => service.id === id2);

        [services[OLD], services[NEW]] = [services[NEW], services[OLD]];

        set({ services });
    },
    usePreset: () => {
        get().clear();
        const ids = ['5106fdb4-04a3-4659-8d76-54a79fbf45a2', '2b027a28-172a-4180-bd5a-32070b046b77'];
        const templates = get().templates.filter((service) => ids.includes(service.id));
        templates.map((template) => get().addFromTemplate(template));
    },
    useFile: (services: Service[]) => {
        get().clear();
        services.map((service) => get().add(service));
    },
});
