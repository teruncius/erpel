import { nativeImage, NativeImage } from "electron";

export async function loadNativeImage(imagePath: string | null): Promise<NativeImage | null> {
    if (imagePath === null) {
        return null;
    }

    if (imagePath.startsWith("http")) {
        console.log("Image path is a URL:", imagePath);
        try {
            const response = await fetch(imagePath, {
                credentials: "include",
            });
            const blob = await response.blob();
            const buffer = Buffer.from(await blob.arrayBuffer());
            return nativeImage.createFromBuffer(buffer);
        } catch (error) {
            console.error("Error fetching image:", error);
            return null;
        }
    }

    if (imagePath.startsWith("data:")) {
        console.log("Image path is a data URL:", imagePath);
        return nativeImage.createFromDataURL(imagePath);
    }

    console.error("Invalid image path:", imagePath);
    return null;
}
