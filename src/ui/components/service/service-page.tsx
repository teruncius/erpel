import { useEffect } from "react";
import { useParams } from "react-router";

import { ElectronWindow } from "@erpel/renderer/preload-features/app-bridge";

declare const window: ElectronWindow;

export function ServicePage() {
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            window.electron.activateService(id);
        }
    }, [id]);

    return <></>;
}
