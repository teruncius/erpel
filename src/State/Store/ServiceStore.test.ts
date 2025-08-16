import { beforeEach, describe, expect, test } from 'vitest';
import { create } from 'zustand/index';
import { createServiceSlice, ServiceStoreState, ServiceStoreActions } from './ServiceStore';

export const useStore = create<ServiceStoreState & ServiceStoreActions>()(
    (...args) => ({
        ...createServiceSlice(...args),
    }),
);

describe('ServiceStore', () => {
    beforeEach(() => {
        useStore.setState(useStore.getInitialState());
    });

    test('services are initially empty', () => {
        expect(useStore.getState().services).toEqual([]);
    });

    test('service templates are initially empty', () => {
        expect(useStore.getState().templates).toEqual([]);
    });
});
