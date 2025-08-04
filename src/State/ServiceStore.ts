import { ServiceTemplate, Service, SERVICES, ServiceFromTemplate } from './Settings';
import { StateCreator } from 'zustand/vanilla';
import { ElectronWindow } from '../PreloadFeatures/AppBridge';

export type ServiceStoreState = {
    services: Service[]
    templates: ServiceTemplate[]
}

export type ServiceStoreActions = {
    add: (service: Service) => void
    addFromTemplate: (template: ServiceTemplate) => void
    remove: (id: string) => void
    clear: () => void
    swap: (id1: string, id2: string) => void
    usePreset: () => void
    useFile: (services: Service[]) => void
}

const initialValues: ServiceStoreState = {
    services: [],
    templates: SERVICES,
};

declare const window: ElectronWindow;

export const createServiceSlice: StateCreator<ServiceStoreState & ServiceStoreActions> = (set, get) => ({
    ...initialValues,
    add: (service: Service) => {
        set({ services: [...get().services, service] });
        window.electron.addService(service);
    },
    addFromTemplate: (template: ServiceTemplate) => {
        get().add(ServiceFromTemplate(template));
    },
    remove: (id: string) => {
        const list = get().services.filter((service) => service.id !== id);
        set({ services: list });
        window.electron.removeService(id);
    },
    clear: () => {
        get().services.map((service) => get().remove(service.id));
    },
    swap: (id1: string, id2: string) => {
        const services = [...get().services];
        const OLD = services.findIndex((service) => service.id === id1);
        const NEW = services.findIndex((service) => service.id === id2);

        [services[OLD], services[NEW]] = [services[NEW], services[OLD]];

        set({ services: services });
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
