export const AppMessage = {
    ActivateService: "set-active-service",
    AddService: "add-service",
    FocusWindow: "focus-application",
    HideAllServices: "hide-all-services",
    LoadConfig: "load-config",
    RemoveService: "remove-service",
    SaveConfig: "save-config",
    SetSideBarState: "set-side-bar-state",
    ShouldUseDarkMode: "should-use-dark-mode",
    ShowContextMenu: "show-context-menu",
} as const;

export type AppMessage = (typeof AppMessage)[keyof typeof AppMessage];
