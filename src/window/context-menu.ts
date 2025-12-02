import { IpcMainEvent, Menu, NativeImage, clipboard, shell } from "electron";

import { loadNativeImage } from "@erpel/common/image";

interface BuildMenuOptions {
    data: {
        x: number;
        y: number;
        url: string | null;
        image: {
            url: string | null;
            data: NativeImage | null;
        };
        isEditable: boolean;
        content: string | null;
    };
    event: IpcMainEvent;
    isServiceWindow: boolean;
}

export async function buildMenuForSender(options: BuildMenuOptions) {
    return Menu.buildFromTemplate([
        ...(await getCopyImageItems(options)),
        ...getCopyURLItems(options),
        ...getCopyTextItems(options),
        {
            type: "separator",
        },
        ...getServiceWindowItems(options),
        {
            type: "separator",
        },
        ...getReloadItems(options),
        {
            click: () => {
                options.event.sender.openDevTools({ mode: "bottom" });
            },
            label: "Open developer tools",
        },
        {
            click: () => {
                options.event.sender.openDevTools({ mode: "bottom" });
                options.event.sender.inspectElement(options.data.x, options.data.y);
            },
            label: "Inspect element",
        },
    ]);
}

async function getCopyImageItems({ data }: BuildMenuOptions) {
    if (!data.image.data && !data.image.url) {
        return [];
    }
    // try to get the image from the event, if not available, try to load it from the URL
    const image = data.image.data || (await loadNativeImage(data.image.url));
    if (!image) {
        console.error("Failed to load image:", data.image.url);
        return [];
    }
    return [
        {
            click: () => {
                clipboard.writeImage(image);
            },
            label: "Copy Image",
        },
    ];
}

function getCopyURLItems({ data }: BuildMenuOptions) {
    if (!data.url) {
        return [];
    }
    return [
        {
            click: () => {
                clipboard.writeText(data.url!);
            },
            label: "Copy URL",
        },
    ];
}

function getCopyTextItems({ data }: BuildMenuOptions) {
    const items = [];
    if (data.isEditable) {
        items.push({
            role: "cut" as const,
        });
    }
    if (data.content !== null) {
        items.push({
            role: "copy" as const,
        });
    }
    if (data.isEditable) {
        items.push({
            role: "paste" as const,
        });
    }
    return items;
}

function getServiceWindowItems({ isServiceWindow, event }: BuildMenuOptions) {
    if (!isServiceWindow) {
        return [];
    }
    return [
        {
            click: () => {
                clipboard.writeText(event.sender.getURL());
            },
            label: "Copy service URL",
        },
        {
            click: () => {
                shell.openExternal(event.sender.getURL());
            },
            label: "Open service in browser",
        },
    ];
}

function getReloadItems({ isServiceWindow, event }: BuildMenuOptions) {
    return [
        {
            click: () => {
                event.sender.reloadIgnoringCache();
            },
            label: `Reload ${isServiceWindow ? "this service" : "erpel window"}`,
        },
    ];
}
