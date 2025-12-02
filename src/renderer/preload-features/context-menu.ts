import { ipcRenderer, NativeImage } from "electron";

import { AppMessage } from "@erpel/app-message";
import { loadNativeImage } from "@erpel/common/image";

window.addEventListener("contextmenu", async (event: PointerEvent) => {
    event.preventDefault();

    const isEditable = getIsEditable((event.target as HTMLElement) || null);
    const content = document.getSelection()?.toString() || null;
    const url = (event.target as HTMLAnchorElement).href || null;
    const image = await getImageData((event.target as HTMLImageElement).src || null);

    ipcRenderer.send(AppMessage.ShowContextMenu, {
        x: event.x,
        y: event.y,
        isEditable,
        url,
        image,
        content,
    });
});

function getIsEditable(target: HTMLElement | null): boolean {
    if (target === null) {
        return false;
    }

    return target.nodeName === "INPUT" || target.nodeName === "TEXTAREA" || target.isContentEditable;
}

async function getImageData(
    imagePath: string | null
): Promise<Promise<{ url: string | null; data: NativeImage | null }> | null> {
    return {
        url: imagePath,
        data: await loadNativeImage(imagePath),
    };
}
