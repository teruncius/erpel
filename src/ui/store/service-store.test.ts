import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { create } from "zustand";

import { Service, ServiceTemplate } from "@erpel/state/schema";
import { createServiceSlice, ServiceStoreActions, ServiceStoreState } from "./service-store";

// Mock the window.electron object
const mockAddService = vi.fn();
const mockRemoveService = vi.fn();

// Create a test store
const useTestStore = create<ServiceStoreActions & ServiceStoreState>()((...args) => ({
    ...createServiceSlice(...args),
}));

describe("ServiceStore", () => {
    beforeEach(() => {
        // Mock the window.electron object
        (globalThis.window as unknown as { electron: { addService: unknown; removeService: unknown } }).electron = {
            addService: mockAddService,
            removeService: mockRemoveService,
        };

        // Reset store to initial state
        useTestStore.setState(useTestStore.getInitialState());
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Initial State", () => {
        it("services are initially empty", () => {
            expect(useTestStore.getState().services).toEqual([]);
        });

        it("service templates are initially empty", () => {
            expect(useTestStore.getState().templates).toEqual([]);
        });
    });

    describe("Service Management", () => {
        const mockService: Service = {
            id: "test-service-1",
            name: "Test Service",
            url: "https://example.com",
            icon: "test-icon",
            darkMode: false,
            template: {
                id: "template-1",
                name: { copyOnCreate: false, customizable: true, default: "Test Template" },
                url: { copyOnCreate: false, customizable: false, default: "https://example.com" },
                icon: { copyOnCreate: false, customizable: false, default: "test-icon" },
                darkMode: { copyOnCreate: false, customizable: false, default: false },
                tags: ["test"],
            },
        };

        it("adds a service", () => {
            useTestStore.getState().add(mockService);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(1);
            expect(state.services[0]).toEqual(mockService);
            expect(mockAddService).toHaveBeenCalledWith(mockService);
        });

        it("adds multiple services", () => {
            const service2: Service = {
                ...mockService,
                id: "test-service-2",
                name: "Test Service 2",
            };

            useTestStore.getState().add(mockService);
            useTestStore.getState().add(service2);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(2);
            expect(mockAddService).toHaveBeenCalledTimes(2);
        });

        it("removes a service", () => {
            useTestStore.getState().add(mockService);
            useTestStore.getState().remove(mockService.id);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(0);
            expect(mockRemoveService).toHaveBeenCalledWith(mockService.id);
        });

        it("removes non-existent service gracefully", () => {
            useTestStore.getState().remove("non-existent-id");

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(0);
            expect(mockRemoveService).toHaveBeenCalledWith("non-existent-id");
        });

        it("replaces an existing service", () => {
            useTestStore.getState().add(mockService);

            const updatedService: Service = {
                ...mockService,
                name: "Updated Service",
                url: "https://updated.example.com",
            };

            useTestStore.getState().replace(mockService.id, updatedService);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(1);
            expect(state.services[0]).toEqual(updatedService);
            expect(mockRemoveService).toHaveBeenCalledWith(mockService.id);
            expect(mockAddService).toHaveBeenCalledWith(updatedService);
        });

        it("adds new service when replacing non-existent service", () => {
            const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

            useTestStore.getState().replace("non-existent-id", mockService);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(1);
            expect(state.services[0]).toEqual(mockService);
            expect(consoleSpy).toHaveBeenCalledWith(
                "Unable to replace service non-existent-id, because it was not found. Adding the new service instead."
            );
            expect(mockAddService).toHaveBeenCalledWith(mockService);

            consoleSpy.mockRestore();
        });

        it("clears all services", () => {
            useTestStore.getState().add(mockService);
            useTestStore.getState().add({
                ...mockService,
                id: "test-service-2",
            });

            useTestStore.getState().clear();

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(0);
            expect(mockRemoveService).toHaveBeenCalledTimes(2);
        });
    });

    describe("Service Templates", () => {
        const mockTemplate: ServiceTemplate = {
            id: "template-1",
            name: { copyOnCreate: true, customizable: true, default: "Test Template" },
            url: { copyOnCreate: true, customizable: true, default: "https://template.com" },
            icon: { copyOnCreate: true, customizable: true, default: "template-icon" },
            darkMode: { copyOnCreate: true, customizable: true, default: false },
            tags: ["template"],
        };

        it("adds service from template", () => {
            useTestStore.getState().addFromTemplate(mockTemplate);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(1);
            expect(state.services[0].name).toBe("Test Template");
            expect(state.services[0].url).toBe("https://template.com");
            expect(state.services[0].icon).toBe("template-icon");
            expect(state.services[0].darkMode).toBe(false);
            expect(mockAddService).toHaveBeenCalledTimes(1);
        });

        it("loads services from file", () => {
            const services: Service[] = [
                {
                    id: "file-service-1",
                    name: "File Service 1",
                    url: "https://file1.com",
                    icon: "file-icon-1",
                    darkMode: false,
                    template: mockTemplate,
                },
                {
                    id: "file-service-2",
                    name: "File Service 2",
                    url: "https://file2.com",
                    icon: "file-icon-2",
                    darkMode: true,
                    template: mockTemplate,
                },
            ];

            useTestStore.getState().loadServicesFromFile(services);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(2);
            expect(state.services).toEqual(services);
            expect(mockAddService).toHaveBeenCalledTimes(2);
        });

        it("loads services from preset", () => {
            const presetTemplate1: ServiceTemplate = {
                id: "5106fdb4-04a3-4659-8d76-54a79fbf45a2",
                name: { copyOnCreate: true, customizable: true, default: "Preset Template 1" },
                url: { copyOnCreate: true, customizable: true, default: "https://preset1.com" },
                icon: { copyOnCreate: true, customizable: true, default: "preset-icon-1" },
                darkMode: { copyOnCreate: true, customizable: true, default: false },
                tags: ["preset"],
            };

            const presetTemplate2: ServiceTemplate = {
                id: "2b027a28-172a-4180-bd5a-32070b046b77",
                name: { copyOnCreate: true, customizable: true, default: "Preset Template 2" },
                url: { copyOnCreate: true, customizable: true, default: "https://preset2.com" },
                icon: { copyOnCreate: true, customizable: true, default: "preset-icon-2" },
                darkMode: { copyOnCreate: true, customizable: true, default: true },
                tags: ["preset"],
            };

            const otherTemplate: ServiceTemplate = {
                id: "other-template",
                name: { copyOnCreate: false, customizable: true, default: "Other Template" },
                url: { copyOnCreate: false, customizable: false, default: "https://other.com" },
                icon: { copyOnCreate: false, customizable: false, default: "other-icon" },
                darkMode: { copyOnCreate: false, customizable: false, default: false },
                tags: ["other"],
            };

            // Set up templates
            useTestStore.setState({
                templates: [presetTemplate1, presetTemplate2, otherTemplate],
            });

            useTestStore.getState().loadServicesFromPreset();

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(2);
            expect(state.services[0].name).toBe("Preset Template 1");
            expect(state.services[1].name).toBe("Preset Template 2");
            expect(mockAddService).toHaveBeenCalledTimes(2);
        });
    });

    describe("Service Reordering", () => {
        it("reorders services correctly", () => {
            const service1: Service = {
                id: "service-1",
                name: "Service 1",
                url: "https://service1.com",
                icon: "icon-1",
                darkMode: false,
                template: {
                    id: "template-1",
                    name: { copyOnCreate: false, customizable: true, default: "Template 1" },
                    url: { copyOnCreate: false, customizable: false, default: "https://template1.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "icon-1" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            const service2: Service = {
                id: "service-2",
                name: "Service 2",
                url: "https://service2.com",
                icon: "icon-2",
                darkMode: false,
                template: {
                    id: "template-2",
                    name: { copyOnCreate: false, customizable: true, default: "Template 2" },
                    url: { copyOnCreate: false, customizable: false, default: "https://template2.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "icon-2" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            const service3: Service = {
                id: "service-3",
                name: "Service 3",
                url: "https://service3.com",
                icon: "icon-3",
                darkMode: false,
                template: {
                    id: "template-3",
                    name: { copyOnCreate: false, customizable: true, default: "Template 3" },
                    url: { copyOnCreate: false, customizable: false, default: "https://template3.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "icon-3" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            useTestStore.getState().add(service1);
            useTestStore.getState().add(service2);
            useTestStore.getState().add(service3);

            // Move service from index 0 to index 2
            useTestStore.getState().reorder(0, 2);

            const state = useTestStore.getState();
            expect(state.services[0]).toEqual(service2);
            expect(state.services[1]).toEqual(service3);
            expect(state.services[2]).toEqual(service1);
        });

        it("handles reordering with single service", () => {
            const service: Service = {
                id: "service-1",
                name: "Service 1",
                url: "https://service1.com",
                icon: "icon-1",
                darkMode: false,
                template: {
                    id: "template-1",
                    name: { copyOnCreate: false, customizable: true, default: "Template 1" },
                    url: { copyOnCreate: false, customizable: false, default: "https://template1.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "icon-1" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            useTestStore.getState().add(service);
            useTestStore.getState().reorder(0, 0);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(1);
            expect(state.services[0]).toEqual(service);
        });
    });

    describe("Edge Cases", () => {
        it("handles empty service array operations", () => {
            useTestStore.getState().clear();
            useTestStore.getState().loadServicesFromFile([]);
            useTestStore.getState().loadServicesFromPreset();

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(0);
        });

        it("handles duplicate service IDs", () => {
            const service1: Service = {
                id: "duplicate-id",
                name: "Service 1",
                url: "https://service1.com",
                icon: "icon-1",
                darkMode: false,
                template: {
                    id: "template-1",
                    name: { copyOnCreate: false, customizable: true, default: "Template 1" },
                    url: { copyOnCreate: false, customizable: false, default: "https://template1.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "icon-1" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            const service2: Service = {
                id: "duplicate-id",
                name: "Service 2",
                url: "https://service2.com",
                icon: "icon-2",
                darkMode: false,
                template: {
                    id: "template-2",
                    name: { copyOnCreate: false, customizable: true, default: "Template 2" },
                    url: { copyOnCreate: false, customizable: false, default: "https://template2.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "icon-2" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            useTestStore.getState().add(service1);
            useTestStore.getState().add(service2);

            const state = useTestStore.getState();
            expect(state.services).toHaveLength(2);
            expect(state.services[0]).toEqual(service1);
            expect(state.services[1]).toEqual(service2);
        });
    });

    describe("Electron Integration", () => {
        it("calls electron API when adding service", () => {
            const service: Service = {
                id: "test-service",
                name: "Test Service",
                url: "https://example.com",
                icon: "test-icon",
                darkMode: false,
                template: {
                    id: "template-1",
                    name: { copyOnCreate: false, customizable: true, default: "Test Template" },
                    url: { copyOnCreate: false, customizable: false, default: "https://example.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "test-icon" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            useTestStore.getState().add(service);

            expect(mockAddService).toHaveBeenCalledWith(service);
        });

        it("calls electron API when removing service", () => {
            const service: Service = {
                id: "test-service",
                name: "Test Service",
                url: "https://example.com",
                icon: "test-icon",
                darkMode: false,
                template: {
                    id: "template-1",
                    name: { copyOnCreate: false, customizable: true, default: "Test Template" },
                    url: { copyOnCreate: false, customizable: false, default: "https://example.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "test-icon" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            useTestStore.getState().add(service);
            useTestStore.getState().remove(service.id);

            expect(mockRemoveService).toHaveBeenCalledWith(service.id);
        });

        it("calls electron API when replacing service", () => {
            const originalService: Service = {
                id: "test-service",
                name: "Original Service",
                url: "https://original.com",
                icon: "original-icon",
                darkMode: false,
                template: {
                    id: "template-1",
                    name: { copyOnCreate: false, customizable: true, default: "Original Template" },
                    url: { copyOnCreate: false, customizable: false, default: "https://original.com" },
                    icon: { copyOnCreate: false, customizable: false, default: "original-icon" },
                    darkMode: { copyOnCreate: false, customizable: false, default: false },
                    tags: ["test"],
                },
            };

            const updatedService: Service = {
                ...originalService,
                name: "Updated Service",
                url: "https://updated.com",
            };

            useTestStore.getState().add(originalService);
            useTestStore.getState().replace(originalService.id, updatedService);

            expect(mockRemoveService).toHaveBeenCalledWith(originalService.id);
            expect(mockAddService).toHaveBeenCalledWith(updatedService);
        });
    });
});
