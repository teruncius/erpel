import { useCallback } from "react";
import { useNavigate } from "react-router";

import { ElectronWindow } from "@erpel/renderer/preload-features/app-bridge";
import { Icon } from "@erpel/ui/components/icon";
import { ThemedButton } from "@erpel/ui/components/theme/button";

declare const window: ElectronWindow;

export function DebugNotificationsButton() {
    const navigate = useNavigate();

    const handleNotify = useCallback(() => {
        const title = "Settings - erpel";
        const body = "Debug Test Notification";
        const notification = new Notification(title, { body });
        notification.onclick = () => {
            navigate("/settings");
            window.electron.focusWindow();
        };
    }, [navigate]);

    return (
        <ThemedButton onClick={handleNotify}>
            <Icon name="bug" size={20} />
            <>Test Notification</>
        </ThemedButton>
    );
}
