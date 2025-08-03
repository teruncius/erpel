import { ServiceTemplate, Service, SERVICES, ServiceFromTemplate } from './Settings';
import { StateCreator } from 'zustand/vanilla';
import { ElectronWindow } from '../PreloadFeatures/AppBridge';

export type ServiceStoreState = {
    currentServices: Service[]
    availableServices: ServiceTemplate[]
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
    currentServices: [],
    availableServices: SERVICES,
};

declare const window: ElectronWindow;

export const createServiceSlice: StateCreator<ServiceStoreState & ServiceStoreActions> = (set, get) => ({
    ...initialValues,
    add: (service: Service) => {
        set({ currentServices: [...get().currentServices, service] });
        window.electron.addService(service);
    },
    addFromTemplate: (template: ServiceTemplate) => {
        get().add(ServiceFromTemplate(template));
    },
    remove: (id: string) => {
        const list = get().currentServices.filter((service) => service.id !== id);
        set({ currentServices: list });
        window.electron.removeService(id);
    },
    clear: () => {
        get().currentServices.map((service) => get().remove(service.id));
    },
    swap: (id1: string, id2: string) => {
        const services = [...get().currentServices];
        const OLD = services.findIndex((service) => service.id === id1);
        const NEW = services.findIndex((service) => service.id === id2);

        [services[OLD], services[NEW]] = [services[NEW], services[OLD]];

        set({ currentServices: services });
    },
    usePreset: () => {
        get().clear();
        const ids = ['5106fdb4-04a3-4659-8d76-54a79fbf45a2', '2b027a28-172a-4180-bd5a-32070b046b77'];
        const templates = get().availableServices.filter((service) => ids.includes(service.id));
        templates.map((template) => get().addFromTemplate(template));
    },
    useFile: (services: Service[]) => {
        get().clear();
        services.map((service) => get().add(service));
    },
});
