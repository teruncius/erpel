import { ipcRenderer } from "electron";

import { AppMessage } from "@erpel/app-message";

window.addEventListener("contextmenu", async (event: PointerEvent) => {
    event.preventDefault();

    const isEditable = getIsEditable((event.target as HTMLElement) || null);
    const content = (event.target as HTMLElement)?.textContent || null;
    const url = (event.target as HTMLAnchorElement).href || null;
    const image = await getImageBase64((event.target as HTMLImageElement).src || null);

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

async function getImageBase64(imagePath: string | null): Promise<string | null> {
    if (imagePath === null) {
        return null;
    }

    if (imagePath.startsWith("http")) {
        console.log("Image path is a URL:", imagePath);
        try {
            const response = await fetch(imagePath);
            const blob = await response.blob();

            // Convert Blob to Base64 (using FileReader)
            return await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Error fetching image:", error);
            return null;
        }
    } else if (imagePath.startsWith("data:")) {
        console.log("Image path is a data URL:", imagePath);
        return imagePath;
    }

    console.error("Invalid image path:", imagePath);
    return null;
}
