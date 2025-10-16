import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { ElectronWindow } from '../../preload-features/app-bridge';
import { Icon } from '../icon';
import { ThemedButton } from '../theme/button';

declare const window: ElectronWindow;

export function DebugNotificationsButton() {
    const navigate = useNavigate();

    const handleNotify = useCallback(() => {
        const title = 'Settings - erpel';
        const body = 'Debug Test Notification';
        const notification = new Notification(title, { body });
        notification.onclick = () => {
            navigate('/settings');
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
