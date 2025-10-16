import { beforeEach, describe, expect, test } from "vitest";
import { create } from "zustand/index";

import { createServiceSlice, ServiceStoreActions, ServiceStoreState } from "./service-store";

export const useStore = create<ServiceStoreActions & ServiceStoreState>()((...args) => ({
    ...createServiceSlice(...args),
}));

describe("ServiceStore", () => {
    beforeEach(() => {
        useStore.setState(useStore.getInitialState());
    });

    test("services are initially empty", () => {
        expect(useStore.getState().services).toEqual([]);
    });

    test("service templates are initially empty", () => {
        expect(useStore.getState().templates).toEqual([]);
    });
});
